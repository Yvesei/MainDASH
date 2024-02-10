const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const { sessionVersion } = require("../lib/password");
const prisma = new PrismaClient();

const verifyToken = async (req, res, next) => {
  if (req.user) return next();
  const token = req.cookies && req.cookies.token;
  if (!token)
    return res.status(401).json({ error: "Authentication required." });
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired session." });
  }
  if (
    !Number.isInteger(decoded.id) ||
    typeof decoded.sv !== "string" ||
    !/^[a-f0-9]{64}$/.test(decoded.sv)
  )
    return res.status(401).json({ error: "Invalid or expired session." });
  try {
    // Use the current database role, not the potentially stale role in the cookie.
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, password: true },
    });
    if (
      !user ||
      !crypto.timingSafeEqual(
        Buffer.from(decoded.sv, "hex"),
        Buffer.from(sessionVersion(user.id, user.password), "hex")
      )
    )
      return res.status(401).json({ error: "Invalid or expired session." });
    req.user = { id: user.id, role: user.role };
    next();
  } catch (error) {
    next(error);
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Administrator access required." });
  next();
};

module.exports = { verifyToken, requireAdmin };
