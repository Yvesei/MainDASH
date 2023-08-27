var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/authMiddleware"); // Import the middleware

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
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
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

router.post("/uploadSupply", (req, res) => {
  if (!req.files) {
    return res.send({ name: "" });
  }

  const myFile = req.files.file;
  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
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
    return res.send();
  }

  const myFile = req.files.file;
  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
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

router.post("/uploadFileEdit", (req, res) => {
  if (!req.files) {
    return res.send({ name: "" });
  }

  const myFile = req.files.file;
  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
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

router.post("/", async (req, res) => {
  var {
    name,
    number,
    distance,
    providedDateStart,
    image,
    endTask,
    followupBool,
    ...taskData
  } = req.body;
  // endTask = +endTask;
  // followupBool = +followupBool;
  if (endTask === "") {
    endTask = null;
  } else {
    endTask == "true" ? (endTask = true) : (endTask = false);
  }
  if (followupBool === "") {
    followupBool = null;
  } else {
    followupBool == "true" ? (followupBool = true) : (followupBool = false);
  }

  console.log(endTask);
  console.log(followupBool);
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
          distance: parseInt(distance),
          image: image,
        },
      });
    }
    if (providedDateStart != "" && providedDateStart != null) {
      taskData.dateStart = providedDateStart;
    }
    const task = await prisma.task.create({
      data: {
        endTask,
        followupBool,
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
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          clientId: clientid,
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

router.get("/latest", verifyToken, function (req, res, next) {
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
// router.patch("/", function (req, res, next) {
//   prisma.task
//     .update({
//       where: {
//         id: parseInt(req.body.id),
//       },
//       data: req.body,
//     })
//     .then((task) => res.send(task));
// });

router.patch("/", async (req, res) => {
  const {
    id,
    taskId,
    name,
    number,
    distance,
    providedDateStart,
    image,
    ...taskData
  } = req.body;

  try {
    let client = await prisma.client.findUnique({
      where: {
        id: id,
      },
    });
    // can't change the name of an existing user into an existing user
    if (!client) {
      client = await prisma.client.create({
        data: {
          name: name,
          number: number,
          distance: distance,
          image: image,
        },
      });
    } else {
      client = await prisma.client.update({
        where: {
          id: client.id,
        },
        data: {
          name: name,
          number: number,
          distance: distance,
          image: image,
        },
      });
      console.log("create or edit" + client);
    }
    if (providedDateStart !== "" && providedDateStart !== null) {
      taskData.dateStart = providedDateStart;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...taskData,
        client: {
          connect: {
            id: client.id,
          },
        },
      },
    });

    res.json({ message: "Task updated successfully", task: updatedTask });
  } catch (error) {
    console.error("Error updating task:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the task" });
  }
});

module.exports = router;
