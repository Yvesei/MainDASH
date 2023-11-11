var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "20h",
        }
      );

      // Set the token as an HttpOnly cookie
      res.cookie("token", token, { sameSite: "None", secure: true });

      res.json({ success: true, token, role: user.role });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred. Please try again later." });
  }
});

router.post("/logout", (req, res) => {
  // Clear the token cookie by setting it to an empty string with an expired date
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });

  res.json({ success: true, message: "Logged out successfully" });
});
// Protected route example
// router.get("/protected", verifyToken, (req, res) => {
//   res.json({
//     message: "Protected route accessed successfully",
//     user: req.user,
//   });
// });

module.exports = router;
