const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const {
  hashPassword,
  verifyPassword,
  isPasswordHash,
  sessionVersion,
} = require("../lib/password");

const secureCookies =
  process.env.COOKIE_SECURE === "true" ||
  (process.env.NODE_ENV === "production" &&
    process.env.COOKIE_SECURE !== "false");
const cookieOptions = {
  httpOnly: true,
  secure: secureCookies,
  sameSite: secureCookies ? "none" : "lax",
  path: "/",
};

const attempts = new Map();
const windowMs = 15 * 60 * 1000;
const maxAttempts = 10;
router.post("/", async (req, res) => {
  const key = req.ip || "unknown";
  const now = Date.now();
  let entry = attempts.get(key);
  if (!entry || entry.expires <= now) {
    if (attempts.size >= 10000) attempts.delete(attempts.keys().next().value);
    entry = { count: 0, expires: now + windowMs };
    attempts.set(key, entry);
  }
  if (entry.count >= maxAttempts) {
    res.set("Retry-After", String(Math.ceil((entry.expires - now) / 1000)));
    return res
      .status(429)
      .json({ error: "Too many sign-in attempts. Please try again later." });
  }
  entry.count++;
  const { email, password } = req.body;
  if (
    typeof email !== "string" ||
    !email.trim() ||
    typeof password !== "string" ||
    password.length > 1024
  ) {
    return res.status(400).json({ error: "Email and password are required." });
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email: email.trim() },
    });
    if (!user || !(await verifyPassword(password, user.password)))
      return res.json({ success: false });
    let sessionPassword = user.password;
    if (!isPasswordHash(user.password)) {
      const hash = await hashPassword(password);
      const migrated = await prisma.user.updateMany({
        where: { id: user.id, password: user.password },
        data: { password: hash },
      });
      if (!migrated.count) return res.json({ success: false });
      sessionPassword = hash;
    }
    attempts.delete(key);
    const token = jwt.sign(
      { id: user.id, sv: sessionVersion(user.id, sessionPassword) },
      process.env.JWT_KEY,
      { expiresIn: "20h" }
    );
    res.cookie("token", token, {
      ...cookieOptions,
      maxAge: 20 * 60 * 60 * 1000,
    });
    res.json({ success: true, role: user.role });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
