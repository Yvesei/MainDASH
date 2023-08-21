var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/", async (req, res) => {
  const { name, number, distance, providedDateStart, image, ...taskData } =
    req.body;

  try {
    let client = await prisma.client.findUnique({
      where: {
        name: name,
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: name,
          number: number,
          distance: distance,
          image: image,
        },
      });
    }
    if (providedDateStart != "" && providedDateStart != null) {
      taskData.dateStart = providedDateStart;
    }
    const task = await prisma.task.create({
      data: {
        ...taskData,
        client: {
          connect: {
            id: client.id,
          },
        },
      },
    });

    res.json({ message: "Task created successfully", task });
  } catch (error) {
    console.error("Error creating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the task" });
  }
});

router.get("/", function (req, res, next) {
  const { take, skip, clientId } = req.query;
  if (clientId) {
    // Handle fetching tasks by user ID
    const userId = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          clientId: clientId,
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  } else {
    // Handle fetching all tasks
    const takeValue = parseInt(take) || undefined;
    const skipValue = parseInt(skip) || undefined;
    prisma.task
      .findMany({
        take: takeValue,
        skip: skipValue,
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
});

router.get("/latest", function (req, res, next) {
  prisma.task
    .findMany({
      skip: 0,
      take: 9,
      orderBy: {
        Date: "desc",
      },
    })
    .then((tasks) => res.send(tasks));
});
// get a single tasks
router.get("/:id", function (req, res, next) {
  prisma.task
    .findUnique({ where: { id: +req.params.id } })
    .then((task) => res.send(task));
});

// delete a tasks
router.delete("/:id", function (req, res, next) {
  prisma.task
    .delete({ where: { id: +req.params.id } })
    .then((task) => res.send(task));
});

//modify a acticles
router.patch("/", function (req, res, next) {
  prisma.task
    .update({
      where: {
        id: parseInt(req.body.id),
      },
      data: req.body,
    })
    .then((task) => res.send(task));
});

module.exports = router;
