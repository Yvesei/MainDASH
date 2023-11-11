var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/* GET clients listing. */
router.get("/", function (req, res, next) {
  const { take, skip } = req.query; // Extract take and skip from query parameters
  prisma.client
    .findMany({
      take: parseInt(take) || undefined,
      skip: parseInt(skip) || undefined,
    })
    .then((clients) => res.send(clients))
    .catch((err) => res.send(err));
});

router.get("/countAll", async function (req, res, next) {
  try {
    const clientCount = await prisma.client.count({});
    res.status(200).json({ clientCount });
  } catch (error) {
    console.error("Error fetching task count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching task count." });
  }
});
// get a single client
router.get("/:id", function (req, res, next) {
  prisma.client
    .findUnique({ where: { id: +req.params.id } })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});

//post a new client

router.post("/", function (req, res, next) {
  req.body.distance = parseInt(req.body.distance);

  prisma.client
    .create({ data: req.body })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});

// delete a client
router.delete("/:id", async function (req, res, next) {
  const client = await prisma.client.findUnique({
    where: { id: +req.params.id },
  });
  var value = false;
  if (client.deleted == false) value = true;
  prisma.client
    .update({
      where: { id: +req.params.id },
      data: {
        deleted: value,
      },
    })
    .then((task) => res.send(task));
});

//modify a client
router.patch("/", function (req, res, next) {
  let { id, name, number, distance, image } = req.body;
  distance = parseInt(distance);

  prisma.client
    .update({
      where: {
        id: +id,
      },
      data: {
        name,
        number,
        distance,
        image,
      },
    })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});
module.exports = router;
