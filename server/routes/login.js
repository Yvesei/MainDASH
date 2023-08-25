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
          email: user.email,
        },
        process.env.JWT_KEY,
        {
          expiresIn: "20h",
        }
      );

      // Set the token as an HttpOnly cookie
      res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

      res.json({ success: true, token });
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

// Protected route example
// router.get("/protected", verifyToken, (req, res) => {
//   res.json({
//     message: "Protected route accessed successfully",
//     user: req.user,
//   });
// });

module.exports = router;
