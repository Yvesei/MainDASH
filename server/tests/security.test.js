const test = require("node:test");
const assert = require("node:assert/strict");
const jwt = require("jsonwebtoken");
const { hashPassword, verifyPassword, isPasswordHash, sessionVersion } = require("../lib/password");

process.env.JWT_KEY = "test-only-secret";
let account;
const db = {
  user: {
    findUnique: async ({ where, select }) => {
      if (!account || (where.email && where.email !== account.email) || (where.id && where.id !== account.id)) return null;
      if (!select) return { ...account };
      return Object.fromEntries(Object.keys(select).filter(key => select[key]).map(key => [key, account[key]]));
    },
    updateMany: async ({ where, data }) => {
      if (where.id !== account.id || where.password !== account.password) return { count: 0 };
      Object.assign(account, data);
      return { count: 1 };
    },
    update: async ({ data, select }) => {
      Object.assign(account, data);
      return Object.fromEntries(Object.keys(select).map(key => [key, account[key]]));
    },
  },
};
require.cache[require.resolve("@prisma/client")] = {
  id: require.resolve("@prisma/client"), filename: require.resolve("@prisma/client"), loaded: true,
  exports: { PrismaClient: class { constructor() { return db; } } },
};
const login = require("../routes/login");
const users = require("../routes/users");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
function route(router, method, path) {
  return router.stack.find(layer => layer.route?.path === path && layer.route.methods[method]).route.stack.at(-1).handle;
}
function response() {
  return {
    statusCode: 200,
    status(code) { this.statusCode = code; return this; },
    json(value) { this.body = value; return this; },
    cookie(name, value, options) { this.cookieValue = { name, value, options }; return this; },
    set(name, value) { this.headers = { ...this.headers, [name]: value }; return this; },
    clearCookie() { return this; },
  };
}

test("passwords are salted, verified and legacy values remain compatible", async () => {
  const first = await hashPassword("correct horse");
  const second = await hashPassword("correct horse");
  assert.notEqual(first, second);
  assert.ok(isPasswordHash(first));
  assert.equal(await verifyPassword("correct horse", first), true);
  assert.equal(await verifyPassword("wrong", first), false);
  assert.equal(await verifyPassword("legacy", "legacy"), true);
  assert.equal(await verifyPassword("wrong", "legacy"), false);
  assert.equal(await verifyPassword("x", "scrypt$bad"), false);
});

test("successful legacy login upgrades password and sends an HttpOnly cookie", async () => {
  account = { id: 7, email: "person", password: "legacy", role: "USER", name: "Person" };
  const res = response();
  await route(login, "post", "/")({ body: { email: "person", password: "legacy" } }, res);
  assert.equal(res.body.success, true);
  assert.ok(isPasswordHash(account.password));
  assert.equal(await verifyPassword("legacy", account.password), true);
  assert.equal(res.cookieValue.options.httpOnly, true);
  assert.equal(res.body.token, undefined);
  const wrong = response();
  await route(login, "post", "/")({ body: { email: "person", password: "wrong" } }, wrong);
  assert.equal(wrong.body.success, false);
});

test("authorization uses current database role and rejects removed accounts", async () => {
  account = { id: 7, role: "USER", password: "stored hash" };
  const token = jwt.sign({ id: 7, role: "ADMIN", sv: sessionVersion(7, account.password) }, process.env.JWT_KEY);
  const req = { cookies: { token } };
  let continued = false;
  await verifyToken(req, response(), () => { continued = true; });
  assert.equal(continued, true);
  assert.equal(req.user.role, "USER");
  const denied = response();
  requireAdmin(req, denied, () => assert.fail("non-admin passed"));
  assert.equal(denied.statusCode, 403);
  account.password = "changed hash";
  const stale = response();
  await verifyToken({ cookies: { token } }, stale, () => assert.fail("stale session passed"));
  assert.equal(stale.statusCode, 401);
  const legacy = response();
  await verifyToken({ cookies: { token: jwt.sign({ id: 7 }, process.env.JWT_KEY) } }, legacy, () => assert.fail("legacy session passed"));
  assert.equal(legacy.statusCode, 401);
  account = null;
  const removed = response();
  await verifyToken({ cookies: { token } }, removed, () => assert.fail("deleted account passed"));
  assert.equal(removed.statusCode, 401);
});

test("profile changes cannot assign roles and sensitive changes require the current password", async () => {
  account = { id: 7, email: "person", password: await hashPassword("old password"), role: "USER", name: "Person", image: "avatar.png" };
  const update = route(users, "patch", "/current-user");
  const rejected = response();
  await update({ user: { id: 7, role: "USER" }, body: { email: "new", currentPassword: "wrong", role: "ADMIN" } }, rejected, assert.fail);
  assert.equal(rejected.statusCode, 403);
  assert.equal(account.email, "person");
  const saved = response();
  await update({ user: { id: 7, role: "USER" }, body: { email: "new", password: "new password", currentPassword: "old password", role: "ADMIN" } }, saved, assert.fail);
  assert.equal(saved.body.email, "new");
  assert.equal(saved.body.password, undefined);
  assert.equal(account.role, "USER");
  assert.equal(await verifyPassword("new password", account.password), true);
});


test("repeated sign-in failures are rate limited", async () => {
  account = null;
  const handler = route(login, "post", "/");
  for (let index = 0; index < 10; index++) {
    const res = response();
    await handler({ ip: "rate-limit-test", body: { email: "unknown", password: "wrong" } }, res);
    assert.equal(res.body.success, false);
  }
  const limited = response();
  await handler({ ip: "rate-limit-test", body: { email: "unknown", password: "wrong" } }, limited);
  assert.equal(limited.statusCode, 429);
  assert.ok(Number(limited.headers["Retry-After"]) > 0);
});

test("origin guard blocks untrusted browser origins and permits configured origins", () => {
  const previous = process.env.CORS_ORIGINS;
  process.env.CORS_ORIGINS = "https://dashboard.example.test";
  const app = require("../app");
  const guard = app._router.stack.find(layer => layer.name === "<anonymous>").handle;
  function check(origin) {
    const req = { get(name) { return name === "origin" ? origin : "api.example.test"; }, hostname: "api.example.test", protocol: "https" };
    const res = response();
    let allowed = false;
    guard(req, res, () => { allowed = true; });
    return { res, allowed };
  }
  assert.equal(check("https://dashboard.example.test").allowed, true);
  assert.equal(check("https://api.example.test").allowed, true);
  assert.equal(check("https://attacker.example.test").res.statusCode, 403);
  if (previous === undefined) delete process.env.CORS_ORIGINS;
  else process.env.CORS_ORIGINS = previous;
});
