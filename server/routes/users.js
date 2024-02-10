const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { hashPassword, verifyPassword } = require("../lib/password");
const crypto = require("crypto");
const path = require("path");
const fileUpload = require("express-fileupload");

const publicUser = {
  id: true,
  name: true,
  email: true,
  image: true,
  role: true,
};
router.use(verifyToken);
router.get("/verify-user", (req, res) =>
  res.json({ success: true, role: req.user.role })
);
router.get("/current-user-get", async (req, res, next) => {
  try {
    res.json(
      await prisma.user.findUnique({
        where: { id: req.user.id },
        select: publicUser,
      })
    );
  } catch (error) {
    next(error);
  }
});
router.get("/countAll", requireAdmin, async (req, res, next) => {
  try {
    res.json({ userCount: await prisma.user.count() });
  } catch (error) {
    next(error);
  }
});

router.use(
  fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true })
);
async function uploadImage(req, res, next) {
  const file = req.files && req.files.file;
  if (!file)
    return res.json(
      req.path === "/upload"
        ? { name: "avatar.png", path: "/avatar.png" }
        : { msg: "no-image" }
    );
  if (Array.isArray(file) || !file.data || !file.data.length)
    return res.status(400).json({ error: "Choose a valid image." });
  const bytes = file.data;
  let extension;
  if (
    bytes.length >= 8 &&
    bytes
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  )
    extension = "png";
  else if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  )
    extension = "jpg";
  else if (
    bytes.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))
  )
    extension = "gif";
  else if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  )
    extension = "webp";
  else
    return res
      .status(400)
      .json({ error: "Choose a PNG, JPEG, GIF or WebP image." });
  const name = `${crypto.randomBytes(16).toString("hex")}.${extension}`;
  try {
    await file.mv(path.join(__dirname, "../public/uploads/users", name));
    res.json({ name, path: `/${name}` });
  } catch (error) {
    next(error);
  }
}
router.post("/upload", requireAdmin, uploadImage);
router.post("/uploadEdit", uploadImage);

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const take = Number(req.query.take);
    const skip = Number(req.query.skip);
    res.json(
      await prisma.user.findMany({
        ...(Number.isInteger(take) && take > 0 ? { take } : {}),
        ...(Number.isInteger(skip) && skip >= 0 ? { skip } : {}),
        select: publicUser,
      })
    );
  } catch (error) {
    next(error);
  }
});
router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid user ID." });
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select:
        req.user.role === "ADMIN"
          ? publicUser
          : { id: true, name: true, image: true },
    });
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

function userFields(body, admin = false) {
  const data = {};
  for (const key of ["name", "email", "image"]) {
    if (typeof body[key] === "string" && body[key].trim())
      data[key] = body[key].trim();
  }
  if (admin && body.role !== undefined) {
    if (!["ADMIN", "USER"].includes(body.role))
      throw new Error("Invalid role.");
    data.role = body.role;
  }
  return data;
}
function validPassword(password) {
  return (
    typeof password === "string" &&
    password.length > 0 &&
    password.length <= 1024
  );
}
function handleUserError(error, res, next) {
  if (error.code === "P2002")
    return res
      .status(409)
      .json({ error: "An account with this email already exists." });
  if (error.code === "P2025")
    return res.status(404).json({ error: "User not found." });
  next(error);
}
router.post("/", requireAdmin, async (req, res, next) => {
  let data;
  try {
    data = userFields(req.body, true);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  if (
    !data.name ||
    !data.email ||
    !data.role ||
    !validPassword(req.body.password)
  )
    return res
      .status(400)
      .json({ error: "Name, email, role and password are required." });
  try {
    data.password = await hashPassword(req.body.password);
    res
      .status(201)
      .json(await prisma.user.create({ data, select: publicUser }));
  } catch (error) {
    handleUserError(error, res, next);
  }
});
router.delete("/:id", requireAdmin, async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid user ID." });
  if (id === req.user.id)
    return res
      .status(400)
      .json({ error: "You cannot delete your own account." });
  try {
    res.json(await prisma.user.delete({ where: { id }, select: publicUser }));
  } catch (error) {
    handleUserError(error, res, next);
  }
});
async function updateUser(req, res, next, admin) {
  const id = admin ? Number(req.body.id) : req.user.id;
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid user ID." });
  let data;
  try {
    data = userFields(req.body, admin);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  if (
    req.body.password !== undefined &&
    req.body.password !== "" &&
    !validPassword(req.body.password)
  )
    return res.status(400).json({ error: "Invalid password." });
  try {
    if (!admin && (data.email || req.body.password)) {
      const current = await prisma.user.findUnique({
        where: { id },
        select: { email: true, password: true },
      });
      if (!current) return res.status(404).json({ error: "User not found." });
      if ((data.email && data.email !== current.email) || req.body.password) {
        if (!(await verifyPassword(req.body.currentPassword, current.password)))
          return res
            .status(403)
            .json({ error: "Current password is incorrect." });
      }
    }
    if (req.body.password)
      data.password = await hashPassword(req.body.password);
    res.json(
      await prisma.user.update({ where: { id }, data, select: publicUser })
    );
  } catch (error) {
    handleUserError(error, res, next);
  }
}
router.patch("/current-user", (req, res, next) =>
  updateUser(req, res, next, false)
);
router.patch("/", requireAdmin, (req, res, next) =>
  updateUser(req, res, next, true)
);

module.exports = router;
