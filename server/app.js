require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { verifyToken } = require("./middleware/authMiddleware");

const app = express();
const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((value) => value.trim().replace(/\/$/, ""))
    .filter(Boolean)
);

function originAllowed(req, origin) {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  try {
    const source = new URL(origin);
    const host = req.get("host");
    if (source.host === host && source.protocol === `${req.protocol}:`)
      return true;
    return (
      process.env.NODE_ENV !== "production" &&
      source.hostname === req.hostname &&
      ["8080", "5173"].includes(source.port) &&
      ["http:", "https:"].includes(source.protocol)
    );
  } catch (error) {
    return false;
  }
}

app.use((req, res, next) => {
  if (!originAllowed(req, req.get("origin")))
    return res.status(403).json({ error: "Origin not allowed." });
  next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/login", require("./routes/login"));
app.use("/users", require("./routes/users"));
app.use("/tasks", verifyToken, require("./routes/tasks"));
app.use("/clients", verifyToken, require("./routes/client"));
app.use(
  "/uploads",
  verifyToken,
  (req, res, next) => {
    res.set("X-Content-Type-Options", "nosniff");
    res.set("Content-Security-Policy", "default-src 'none'; sandbox");
    next();
  },
  express.static(path.join(__dirname, "public/uploads"))
);

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "An unexpected error occurred." });
});

module.exports = app;
