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

// get a single client
router.get("/:id", function (req, res, next) {
  prisma.client
    .findUnique({ where: { id: +req.params.id } })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});

//post a new client

router.post("/", function (req, res, next) {
  prisma.client
    .create({ data: req.body })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});

// delete a client
router.delete("/:id", function (req, res, next) {
  prisma.client
    .delete({ where: { id: +req.params.id } })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});

//modify a client
router.patch("/", function (req, res, next) {
  const { id, ...clientData } = req.body;
  prisma.client
    .update({
      where: {
        id: +id,
      },
      data: clientData,
    })
    .then((client) => res.send(client))
    .catch((err) => res.send(err));
});
module.exports = router;