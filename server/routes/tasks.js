var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.post("/create-task", async (req, res) => {
  const { clientName, clientNumber, taskData } = req.body;

  try {
    let client = await prisma.client.findUnique({
      where: {
        name: clientName,
      },
    });

    if (!client) {
      client = await prisma.client.create({
        data: {
          name: clientName,
          number: clientNumber,
        },
      });
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

//post a new tasks
// assign the tasks to categories
router.post("/", function (req, res, next) {
  const {
    Date,
    dateStart,
    dateEnd,
    type,
    supply,
    supplyFile,
    devis,
    endTask,
    result,
    followupBool,
    followupAutre,
    client,
  } = req.body;
  const userId = req.body.userId;
  prisma.task
    .create({
      data: {
        Date,
        dateStart,
        dateEnd,
        type,
        supply,
        supplyFile,
        devis,
        endTask,
        result,
        followupBool,
        followupAutre,
        client: {
          connect: client.map((clientId) => ({ id: clientId })),
        },
      },
      include: {
        client: true,
      },
    })
    .then((task) => res.send(task))
    .catch((err) => res.send(err));
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

/* GET tasks listing. */
// router.get('/', function(req, res, next) {
//   const { take, skip } = req.query; // Extract take and skip from query parameters
//   prisma.task.findMany({
//     take: parseInt(take) || undefined,
//     skip: parseInt(skip) || undefined,
//   }).then(tasks => res.send(tasks))
// });

// router.get('/', function(req, res, next) {
//   const userId = parseInt(req.query.userId);
//   prisma.task.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       categories: true,
//     },
//   })
//     .then(tasks => res.send(tasks))
//     .catch(error => next(error));
// });
