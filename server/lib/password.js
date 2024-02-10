const crypto = require("crypto");
const { promisify } = require("util");
const scrypt = promisify(crypto.scrypt);
const PREFIX = "scrypt";

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64);
  return `${PREFIX}$${salt}$${key.toString("hex")}`;
}

async function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string" || password.length > 1024) return false;
  if (stored.startsWith(`${PREFIX}$`)) {
    const parts = stored.split("$");
    if (parts.length !== 3 || !/^[a-f0-9]{32}$/.test(parts[1]) || !/^[a-f0-9]{128}$/.test(parts[2])) return false;
    const expected = Buffer.from(parts[2], "hex");
    const actual = await scrypt(password, parts[1], expected.length);
    return crypto.timingSafeEqual(actual, expected);
  }
  // Legacy plaintext is accepted once and immediately replaced after login.
  const expected = Buffer.from(stored);
  const actual = Buffer.from(password);
  return actual.length === expected.length && crypto.timingSafeEqual(actual, expected);
}

function sessionVersion(id, password) {
  return crypto.createHmac("sha256", process.env.JWT_KEY).update(`${id}:${password}`).digest("hex");
}

module.exports = { hashPassword, verifyPassword, sessionVersion, isPasswordHash: value => typeof value === "string" && value.startsWith(`${PREFIX}$`) };
