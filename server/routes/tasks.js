var express = require("express");
var router = express.Router();
const moment = require("moment");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { verifyToken } = require("../middleware/authMiddleware"); // Import the middleware

// upload
const fileUpload = require("express-fileupload");
// middle ware
router.use(express.static("public")); //to access the files in public folder
router.use(fileUpload());

router.get("/linechart", async (req, res) => {
  const tasks = await prisma.task.findMany({
    orderBy: {
      Date: "desc",
    },
  });

  const currentMonth = moment().month(); // Get the current month (0-indexed)
  const monthCounts = new Array(12).fill(0); // Initialize an array for counts, one slot per month

  // Count tasks for each month
  for (const task of tasks) {
    const date = moment(task.Date);
    const month = date.month();
    monthCounts[month]++;
  }

  // Define month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Create data array
  const data = [];

  // Construct data array for the last 12 months
  for (let i = 0; i < 12; i++) {
    const monthIndex = (currentMonth - i + 12) % 12; // Calculate the correct index
    const monthName = monthNames[monthIndex];
    const count = monthCounts[monthIndex];
    data.unshift({ month: monthName, count });
  }

  res.send(data);
});

router.get("/calculate-time-difference", async (req, res) => {
  const id = +req.query.id;

  try {
    const task = await prisma.task.findUnique({
      where: {
        id: id,
      },
    });
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }

    const startDateTime = moment(task.dateStart);
    const endDateTime = moment(task.dateEnd);

    const duration = moment.duration(endDateTime.diff(startDateTime));
    const hours = duration.hours();
    const minutes = duration.minutes();
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;

    res.status(200).send(formattedTime);
  } catch (error) {
    console.error("Error fetching task count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching task count." });
  }
});

router.get("/calculate-total-time", async (req, res) => {
  try {
    const idArray = req.query.idArray.map(Number);

    const tasks = await prisma.task.findMany({
      where: {
        id: {
          in: idArray,
        },
      },
    });

    let totalHours = 0;
    let totalMinutes = 0;

    for (const task of tasks) {
      const startDateTime = moment(task.dateStart);
      const endDateTime = moment(task.dateEnd);

      const duration = moment.duration(endDateTime.diff(startDateTime));
      totalHours += duration.hours();
      totalMinutes += duration.minutes();
    }

    const formattedTotalTime = `${totalHours
      .toString()
      .padStart(2, "0")}:${totalMinutes.toString().padStart(2, "0")}`;

    res.status(200).send(formattedTotalTime);
  } catch (error) {
    console.error("Error calculating total time:", error);
    res
      .status(500)
      .json({ error: "An error occurred while calculating total time." });
  }
});
router.patch("/markDone", async (req, res) => {
  try {
    const idArray = req.body.params.idArray;
    console.log(idArray);
    const date = new Date();
    console.log(date);
    for (const id of idArray) {
      await prisma.task.update({
        where: {
          id: id,
        },
        data: {
          status: true,
          dateEnd: date,
        },
      });
    }
    res.status(200).send("");
  } catch (error) {
    console.error("Error setting as marked:", error);
    res
      .status(500)
      .json({ error: "An error occurred while  setting as marked." });
  }
});

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
router.get("/countAll", async function (req, res, next) {
  try {
    const taskCount = await prisma.task.count({});
    const DoneCount = await prisma.task.count({
      where: {
        status: true,
      },
    });
    const percent = ((DoneCount * 100) / taskCount).toFixed(2);

    res.status(200).json({ taskCount, percent, DoneCount });
  } catch (error) {
    console.error("Error fetching task count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching task count." });
  }
});

router.get("/count", async function (req, res, next) {
  const clientId = +req.query.id;

  try {
    const taskCount = await prisma.task.count({
      where: {
        clientId: clientId,
      },
    });

    res.status(200).json({ taskCount });
  } catch (error) {
    console.error("Error fetching task count:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching task count." });
  }
});

router.post("/", async (req, res) => {
  var {
    name,
    number,
    distance,
    providedDateStart,
    providedDate,
    image,
    endTask,
    followupBool,
    ...taskData
  } = req.body;
  // endTask = +endTask;
  // followupBool = +followupBool;
  if (endTask === undefined) {
    endTask = null;
  } else {
    endTask == "true" ? (endTask = true) : (endTask = false);
  }
  if (followupBool === undefined) {
    followupBool = null;
  } else {
    followupBool == "true" ? (followupBool = true) : (followupBool = false);
  }
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
    if (providedDate != "" && providedDate != null) {
      console.log(providedDate);
      taskData.Date = providedDate;
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
  const { clientId, type } = req.query;
  if (!type) {
    console.log("no  type");
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          clientId: clientid,
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
  if (type == "Pending") {
    console.log("pending");
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          status: false,
          clientId: clientid,
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
  if (type == "Done") {
    console.log("done");
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          status: true,
          clientId: clientid,
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
});

router.get("/latest", verifyToken, function (req, res, next) {
  const { type } = req.query;
  console.log(type);
  if (!type) {
    prisma.task
      .findMany({
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  if (type == "done") {
    prisma.task
      .findMany({
        where: {
          status: true,
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  if (type == "pending") {
    prisma.task
      .findMany({
        where: {
          status: false,
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
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

router.patch("/", async (req, res) => {
  var {
    id,
    taskId,
    name,
    number,
    distance,
    providedDateStart,
    providedDate,
    endTask,
    followupBool,
    image,
    ...taskData
  } = req.body;

  if (endTask === undefined) {
    endTask = null;
  } else {
    taskData.endTask = endTask;
  }
  if (followupBool === undefined) {
    followupBool = null;
  } else {
    taskData.followupBool = followupBool;
  }

  try {
    let client = {};
    let client2 = {};
    if (id != undefined) {
      console.log("id is defined");
      client = await prisma.client.findUnique({
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
        client2 = await prisma.client.findUnique({
          where: {
            name: name,
          },
        });
        if (client2.id == client.id) {
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
        } else {
          client = client2;
        }
      }
    } else {
      console.log("id is not defined");
      // if id is not provided
      client = await prisma.client.findUnique({
        where: {
          name: name,
        },
      });
    }
    const ID = client.id;
    console.log("ID");
    console.log(ID);
    if (providedDateStart !== "" && providedDateStart !== null) {
      taskData.dateStart = providedDateStart;
    }
    if (providedDate !== "" && providedDate !== null) {
      console.log(providedDate);
      taskData.date = providedDate;
    }

    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...taskData,
        client: {
          connect: {
            id: ID,
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
