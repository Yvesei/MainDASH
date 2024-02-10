const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");

const db = {
  client: { findMany: async () => [], count: async () => 0, findUnique: async () => null, create: async ({ data }) => data, update: async ({ data }) => data },
  task: { groupBy: async () => [] },
};
const originalLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (request === "@prisma/client") return { PrismaClient: class { constructor() { return db; } } };
  return originalLoad.call(this, request, parent, isMain);
};
const router = require("../routes/client");
Module._load = originalLoad;

function handler(method, path) {
  return router.stack.find(layer => layer.route?.path === path && layer.route.methods[method]).route.stack[0].handle;
}
function response() {
  return { statusCode: 200, status(code) { this.statusCode = code; return this; }, json(value) { this.body = value; return this; } };
}
const next = error => { if (error) throw error; };

test("client summary counts only undeleted tasks visible to the current user", async () => {
  db.client.findMany = async query => {
    assert.deepEqual(query.where, {});
    return [{ id: 2, name: "Willow", deleted: false }, { id: 3, name: "Oak", deleted: true }];
  };
  db.task.groupBy = async query => {
    assert.deepEqual(query.where, { deleted: false, clientId: { in: [2, 3] }, createdBy: 9 });
    assert.deepEqual(query._max, { Date: true });
    return [
      { clientId: 2, status: true, _count: { _all: 1 }, _max: { Date: new Date("2024-02-03T12:00:00Z") } },
      { clientId: 2, status: false, _count: { _all: 2 }, _max: { Date: new Date("2024-03-03T12:00:00Z") } },
    ];
  };
  const res = response();
  await handler("get", "/")({ query: { includeHidden: "true", summary: "true" }, user: { id: 9, role: "USER" } }, res, next);
  assert.equal(res.body[0].taskCount, 3);
  assert.equal(res.body[0].pendingCount, 2);
  assert.equal(res.body[0].latestTaskDate.toISOString(), "2024-03-03T12:00:00.000Z");
  assert.equal(res.body[1].taskCount, 0);
  assert.equal(res.body[1].latestTaskDate, null);
});

test("client writes validate names and distance before touching the database", async () => {
  const res = response();
  await handler("post", "/")({ body: { name: "  ", distance: 1 } }, res, next);
  assert.equal(res.statusCode, 400);
  const negative = response();
  await handler("post", "/")({ body: { name: "Willow", distance: -1 } }, negative, next);
  assert.equal(negative.statusCode, 400);
  const valid = response();
  await handler("post", "/")({ body: { name: "  Willow ", distance: "12", number: " 123 " } }, valid, next);
  assert.deepEqual(valid.body, { name: "Willow", number: "123", distance: 12 });
  assert.equal(valid.statusCode, 201);
});

test("only administrators can hide or restore clients", async () => {
  const denied = response();
  await handler("delete", "/:id")({ params: { id: "2" }, user: { role: "USER" } }, denied, next);
  assert.equal(denied.statusCode, 403);
  db.client.findUnique = async () => ({ id: 2, deleted: true });
  db.client.update = async ({ data }) => data;
  const restored = response();
  await handler("delete", "/:id")({ params: { id: "2" }, user: { role: "ADMIN" } }, restored, next);
  assert.equal(restored.body.deleted, false);
});
