var express = require("express");
var router = express.Router();
const moment = require("moment");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize ClamAV scanner
// const clamscan = new ClamScan();
const mime = require("mime-types");
const { verifyToken } = require("../middleware/authMiddleware");
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

    const date = new Date();

    if (idArray.length == undefined) {
      await prisma.task.update({
        where: {
          id: idArray,
        },
        data: {
          status: true,
          dateEnd: date,
        },
      });
    } else {
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
  function isAllowedImageType(mimeType) {
    const allowedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
      "image/vnd.microsoft.icon",
    ];

    return allowedImageTypes.includes(mimeType);
  }
  const myFile = req.files.file;
  const buffer = myFile.data;

  const mimeType = mime.lookup(myFile.name);
  if (!mimeType || !isAllowedImageType(mimeType)) {
    return res.status(400).send({ msg: "Invalid file type." });
  }

  const myFileSplit = myFile.name.split(".");
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
    function (err) {
      if (err) {
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({ name: myFile.name, path: `/${myFile.name}` });
    }
  );
});
const tmp = require("tmp-promise");
const fs = require("fs").promises;
const ClamScan = require("clamscan");
// Initialize ClamAV scanner
const clamscan = new ClamScan();
router.post("/uploadSupply", async (req, res) => {
  if (!req.files) {
    return res.send({ name: "" });
  }
  const myFile = req.files.file;

  function isAllowedImageType(mimeType) {
    const allowedImageTypes = [
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
      "image/x-icon",
      "image/vnd.microsoft.icon",
      "application/pdf",
      "text/plain",
      "text/markdown",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    return allowedImageTypes.includes(mimeType);
  }
  const buffer = myFile.data;

  const mimeType = mime.lookup(myFile.name);
  if (!mimeType || !isAllowedImageType(mimeType)) {
    return res.status(400).send({ msg: "Invalid file type." });
  }

  const maxFileSize = 5 * 1024 * 1024;
  if (myFile.size > maxFileSize) {
    return res.status(400).send({ msg: "File size exceeds the limit." });
  }

  var lastIndex = myFile.name.lastIndexOf(".");
  const myFileSplit = [
    myFile.name.slice(0, lastIndex),
    myFile.name.slice(lastIndex + 1),
  ];
  const date = new Date();
  myFile.name = date.getTime() + "." + myFileSplit[1];

  myFile.mv(
    `${__dirname}/../public/uploads/tasks/${myFile.name}`,
    function (err) {
      if (err) {
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
        return res.status(500).send({ msg: "Error occured" });
      }
      // returing the response with file path and name
      return res.send({ name: myFile.name, path: `/${myFile.name}` });
    }
  );
});
router.get("/countAll", async function (req, res, next) {
  try {
    const taskCount = await prisma.task.count({
      where: {
        deleted: false,
      },
    });
    const DoneCount = await prisma.task.count({
      where: {
        status: true,
        deleted: false,
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
        deleted: false,
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

router.post("/", verifyToken, async (req, res) => {
  const userid = req.user.id;
  var {
    name,
    number,
    distance,
    providedDateStart,
    providedDate,
    image,
    endTask,
    followupBool,
    supplyFile,
    ...taskData
  } = req.body;
  supplyFile = supplyFile.toString();
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
      taskData.Date = providedDate;
    }

    const task = await prisma.task.create({
      data: {
        endTask,
        followupBool,
        supplyFile,
        ...taskData,
        client: {
          connect: {
            id: client.id,
          },
        },
        user: {
          connect: {
            id: userid,
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
  var filter = [];

  if (req.query.filter) {
    filter = req.query.filter;

    filter = filter.split(",");

    filter[0] = new Date(filter[0]);
    filter[1] = new Date(filter[1]);
    filter[1].setDate(filter[1].getDate() + 1);
  } else {
    filter[0] = new Date("Wed Dec 12 2012 00:00:00 GMT 0000 (GMT)");
    filter[1] = new Date("Thu Dec 12 2999 00:00:00 GMT 0000 (GMT)");
  }
  console.log(filter);
  if (!type) {
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          clientId: clientid,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
  if (type == "Pending") {
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          status: false,
          clientId: clientid,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
  if (type == "Done") {
    const clientid = parseInt(clientId);
    prisma.task
      .findMany({
        where: {
          status: true,
          clientId: clientid,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks))
      .catch((error) => next(error));
  }
});
router.get("/latest", verifyToken, function (req, res, next) {
  const { type } = req.query;
  const { deleted } = req.query;
  var filter = [];

  if (req.query.filter) {
    filter = req.query.filter;

    filter = filter.split(",");

    filter[0] = new Date(filter[0]);
    filter[1] = new Date(filter[1]);
    filter[1].setDate(filter[1].getDate() + 1);
  } else {
    filter[0] = new Date("Wed Dec 12 2012 00:00:00 GMT 0000 (GMT)");
    filter[1] = new Date("Thu Dec 12 2999 00:00:00 GMT 0000 (GMT)");
  }
  console.log(filter);

  if (!type && deleted == "undeleted") {
    prisma.task
      .findMany({
        where: {
          deleted: false,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
          // dateEnd: {
          //   lte: filter[1],
          // },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  // done + !deleted
  if (type == "Done" && deleted == "undeleted") {
    prisma.task
      .findMany({
        where: {
          deleted: false,
          status: true,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  // pending + !deleted
  else if (type == "Pending" && deleted == "undeleted") {
    prisma.task
      .findMany({
        where: {
          deleted: false,
          status: false,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  // deleted
  if (!type && deleted == "deleted") {
    prisma.task
      .findMany({
        where: {
          deleted: true,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  } else if (type == "Pending" && deleted == "deleted") {
    prisma.task
      .findMany({
        where: {
          deleted: true,
          status: false,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  } else if (type == "Done" && deleted == "deleted") {
    prisma.task
      .findMany({
        where: {
          deleted: true,
          status: true,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  // show all

  if (!type && deleted == "none") {
    prisma.task
      .findMany({
        where: {
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  if (type == "Done" && deleted == "none") {
    prisma.task
      .findMany({
        where: {
          status: true,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
        },
        orderBy: {
          Date: "desc",
        },
      })
      .then((tasks) => res.send(tasks));
  }
  if (type == "Pending" && deleted == "none") {
    prisma.task
      .findMany({
        where: {
          status: false,
          Date: {
            gte: filter[0],
            lte: filter[1],
          },
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

// delete a tasks 000000
router.delete("/:id", async function (req, res, next) {
  const task = await prisma.task.findUnique({
    where: { id: +req.params.id },
  });
  console.log(task);
  var value = false;
  if (task.deleted == false) value = true;
  prisma.task
    .update({
      where: { id: +req.params.id },
      data: {
        deleted: value,
      },
    })
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
    supplyFile,
    ...taskData
  } = req.body;
  supplyFile = supplyFile.toString();
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
      // if id is not provided
      client = await prisma.client.findUnique({
        where: {
          name: name,
        },
      });
    }
    const ID = client.id;

    if (providedDateStart !== "" && providedDateStart !== null) {
      taskData.dateStart = providedDateStart;
    }

    if (providedDate !== "" && providedDate !== null) {
      // Assuming providedDate is a string in the format "2023-11-06T23:00:00.000Z1"
      const adjustedDate = moment(providedDate).add(1, "hours");

      // Set the taskData.Date with the adjusted date
      taskData.Date = adjustedDate.toISOString();

      console.log("providedDate");
      console.log(adjustedDate);
    }
    taskData.supplyFile = supplyFile;
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
