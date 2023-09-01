var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/authMiddleware.js");

router.get("/verify-user", verifyToken, (req, res) => {
  // If the request reaches here, it means the user exists and the token is valid
  res.json({ success: true });
});
router.get("/current-user-get", verifyToken, async (req, res, next) => {
  const userid = req.user.id;
  await prisma.user
    .findUnique({ where: { id: userid } })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

router.get("/countAll", async function (req, res, next) {
  try {
    const userCount = await prisma.user.count({});
    res.status(200).json({ userCount });
  } catch (error) {
    console.error("Error fetching task count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching task count." });
  }
});
// upload
const fileUpload = require("express-fileupload");
// middle ware
router.use(express.static("public")); //to access the files in public folder
router.use(fileUpload());

router.post("/upload", (req, res) => {
  if (!req.files) {
    return res.send({ name: "avatar.png", path: "/avatar.png" });
  }

  const myFile = req.files.file;
  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/users/${myFile.name}`,
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({ name: myFile.name, path: `/${myFile.name}` });
    }
  );
});
router.post("/uploadEdit", (req, res) => {
  if (!req.files) {
    return res.status(200).send({ msg: "no-image" });
  }

  const myFile = req.files.file;
  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/users/${myFile.name}`,
    function (err) {
      if (err) {
        console.log(err);
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({ name: myFile.name, path: `/${myFile.name}` });
    }
  );
});
/* GET users listing. */
router.get("/", function (req, res, next) {
  const { take, skip } = req.query; // Extract take and skip from query parameters
  prisma.user
    .findMany({
      take: parseInt(take) || undefined,
      skip: parseInt(skip) || undefined,
    })
    .then((users) => res.send(users))
    .catch((err) => res.send(err));
});

// get a single user
router.get("/:id", function (req, res, next) {
  prisma.user
    .findUnique({ where: { id: +req.params.id } })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

//post a new user
router.post("/", function (req, res, next) {
  console.log(req.body);
  prisma.user
    .create({ data: req.body })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

// delete a user
router.delete("/:id", function (req, res, next) {
  prisma.user
    .delete({ where: { id: +req.params.id } })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

//modify a user
router.patch("/", function (req, res, next) {
  const { id, ...userData } = req.body;
  prisma.user
    .update({
      where: {
        id: +id,
      },
      data: userData,
    })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

router.patch("/current-user", verifyToken, function (req, res, next) {
  const user = req.user; // id + email + iat + exp
  const userdata = req.body;
  const propertyKeys = Object.keys(userdata);

  for (const propertyKey of propertyKeys) {
    if (userdata[propertyKey] === "") {
      console.log(`Property name: ${propertyKey}`);
      delete userdata[propertyKey];
    }
  }
  console.log(userdata);
  prisma.user
    .update({
      where: {
        id: +user.id,
      },
      data: userdata,
    })
    .then((user) => res.send(user))
    .catch((err) => res.send(err));
});

module.exports = router;
