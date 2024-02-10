var express = require("express");
var router = express.Router();
const moment = require("moment");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Initialize ClamAV scanner
// const clamscan = new ClamScan();
const { verifyToken } = require("../middleware/authMiddleware");

// All task queries are restricted to their owner unless the requester is an admin.
const taskScope = (user) =>
  user.role === "ADMIN" ? {} : { createdBy: user.id };
const taskFields = [
  "type",
  "supply",
  "devis",
  "result",
  "followupAutre",
  "dateEnd",
  "dateStart",
  "Date",
];
const allowedTaskData = (data) =>
  Object.fromEntries(
    taskFields
      .filter((key) => data[key] !== undefined)
      .map((key) => [key, data[key]])
  );
// upload
const fileUpload = require("express-fileupload");
// middle ware
router.use(
  fileUpload({ limits: { fileSize: 5 * 1024 * 1024 }, abortOnLimit: true })
);

// Count each calendar month separately so older years do not inflate the chart.
router.get("/linechart", async (req, res, next) => {
  try {
    const firstMonth = moment().startOf("month").subtract(11, "months");
    const tasks = await prisma.task.findMany({
      where: {
        ...taskScope(req.user),
        deleted: false,
        Date: { gte: firstMonth.toDate() },
      },
      select: { Date: true },
    });
    const counts = new Map();
    for (const task of tasks) {
      if (!task.Date) continue;
      const month = moment(task.Date).format("YYYY-MM");
      counts.set(month, (counts.get(month) || 0) + 1);
    }
    res.send(
      Array.from({ length: 12 }, (_, index) => {
        const month = firstMonth.clone().add(index, "months");
        return {
          month: month.format("MMMM"),
          count: counts.get(month.format("YYYY-MM")) || 0,
        };
      })
    );
  } catch (error) {
    next(error);
  }
});

function taskMinutes(task) {
  if (!task.dateStart || !task.dateEnd) return 0;
  return Math.max(
    0,
    Math.floor(
      moment(task.dateEnd).diff(moment(task.dateStart), "minutes", true)
    )
  );
}

function formatMinutes(minutes) {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60
  ).padStart(2, "0")}`;
}

router.get("/calculate-time-difference", async (req, res, next) => {
  const id = Number(req.query.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid task ID." });
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task || (req.user.role !== "ADMIN" && task.createdBy !== req.user.id))
      return res.status(404).json({ error: "Task not found." });
    res.send(formatMinutes(taskMinutes(task)));
  } catch (error) {
    next(error);
  }
});

router.get("/calculate-total-time", async (req, res, next) => {
  // Axios serializes arrays as idArray[], while other clients may use idArray.
  const value = req.query.idArray || req.query["idArray[]"] || [];
  const ids = (Array.isArray(value) ? value : [value]).map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    return res.status(400).json({ error: "Invalid task IDs." });
  }
  try {
    const tasks = await prisma.task.findMany({
      where: { ...taskScope(req.user), id: { in: ids } },
    });
    res.send(
      formatMinutes(tasks.reduce((total, task) => total + taskMinutes(task), 0))
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/markDone", async (req, res, next) => {
  const value = req.body.params?.idArray ?? req.body.idArray;
  const ids = (Array.isArray(value) ? value : [value]).map(Number);
  if (ids.some((id) => !Number.isInteger(id) || id <= 0)) {
    return res.status(400).json({ error: "Invalid task IDs." });
  }
  try {
    // Preserve the completion time when an already completed task is selected again.
    await prisma.task.updateMany({
      where: {
        ...taskScope(req.user),
        deleted: false,
        id: { in: ids },
        OR: [{ status: false }, { status: null }],
      },
      data: { status: true, dateEnd: new Date() },
    });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// Uploads are served by the app, so accept only known file types and inspect
// their signatures. Random names avoid collisions and ignore user-supplied paths.
const crypto = require("crypto");
const path = require("path");
const imageExtensions = new Set([".jpg", ".jpeg", ".png", ".gif", ".webp"]);
const attachmentExtensions = new Set([
  ...imageExtensions,
  ".pdf",
  ".txt",
  ".md",
  ".doc",
  ".docx",
]);
function validSignature(extension, data) {
  if (extension === ".jpg" || extension === ".jpeg")
    return (
      data.length >= 3 &&
      data[0] === 0xff &&
      data[1] === 0xd8 &&
      data[2] === 0xff
    );
  if (extension === ".png")
    return data
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (extension === ".gif")
    return ["GIF87a", "GIF89a"].includes(data.subarray(0, 6).toString("ascii"));
  if (extension === ".webp")
    return (
      data.subarray(0, 4).toString("ascii") === "RIFF" &&
      data.subarray(8, 12).toString("ascii") === "WEBP"
    );
  if (extension === ".pdf")
    return data.subarray(0, 5).toString("ascii") === "%PDF-";
  if (extension === ".docx")
    return data.subarray(0, 4).equals(Buffer.from([0x50, 0x4b, 0x03, 0x04]));
  if (extension === ".doc")
    return data
      .subarray(0, 8)
      .equals(Buffer.from([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]));
  return (extension === ".txt" || extension === ".md") && !data.includes(0);
}
function uploadFile(allowed, fallback) {
  return async (req, res) => {
    const file = req.files && req.files.file;
    if (!file) return res.send(fallback);
    if (Array.isArray(file) || !file.data || file.size > 5 * 1024 * 1024)
      return res.status(400).json({ msg: "Select one file under 5 MB." });
    const extension = path.extname(file.name).toLowerCase();
    if (!allowed.has(extension) || !validSignature(extension, file.data))
      return res.status(400).json({ msg: "Unsupported or invalid file type." });
    const name = `${crypto.randomBytes(16).toString("hex")}${extension}`;
    try {
      await file.mv(path.join(__dirname, "../public/uploads/tasks", name));
      res.send({ name, path: `/${name}` });
    } catch (error) {
      res.status(500).json({ msg: "Could not save the file." });
    }
  };
}
router.post(
  "/upload",
  uploadFile(imageExtensions, { name: "avatar.png", path: "/avatar.png" })
);
router.post("/uploadEdit", uploadFile(imageExtensions, {}));
router.post("/uploadSupply", uploadFile(attachmentExtensions, { name: "" }));
router.post("/uploadFileEdit", uploadFile(attachmentExtensions, { name: "" }));
router.get("/countAll", async function (req, res, next) {
  try {
    const taskCount = await prisma.task.count({
      where: {
        ...taskScope(req.user),
        deleted: false,
      },
    });
    const DoneCount = await prisma.task.count({
      where: {
        ...taskScope(req.user),
        status: true,
        deleted: false,
      },
    });
    const percent = taskCount
      ? ((DoneCount * 100) / taskCount).toFixed(2)
      : "0.00";

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
        ...taskScope(req.user),
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
  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ error: "A client name is required." });
  name = name.trim();
  if (
    distance !== "" &&
    distance != null &&
    (!Number.isInteger(Number(distance)) || Number(distance) < 0)
  )
    return res
      .status(400)
      .json({ error: "Distance must be a non-negative whole number." });
  supplyFile = supplyFile == null ? "" : supplyFile.toString();
  // endTask = +endTask;
  // followupBool = +followupBool;
  if (endTask == null) {
    endTask = null;
  } else {
    endTask = endTask === true || endTask === "true";
  }
  if (followupBool == null) {
    followupBool = null;
  } else {
    followupBool = followupBool === true || followupBool === "true";
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
          distance:
            distance === "" || distance == null ? null : Number(distance),
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
        ...allowedTaskData(taskData),
        status: false,
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

function taskFilter(query) {
  const where = {};
  if (query.type === "Done") where.status = true;
  else if (query.type === "Pending")
    where.OR = [{ status: false }, { status: null }];
  else if (query.type) throw new Error("Invalid task status.");

  if (query.filterStart || query.filterEndExclusive) {
    if (
      (query.filterStart && typeof query.filterStart !== "string") ||
      (query.filterEndExclusive && typeof query.filterEndExclusive !== "string")
    )
      throw new Error("Invalid date range.");
    const start = query.filterStart ? new Date(query.filterStart) : null;
    const end = query.filterEndExclusive
      ? new Date(query.filterEndExclusive)
      : null;
    if (
      (start && Number.isNaN(start.getTime())) ||
      (end && Number.isNaN(end.getTime())) ||
      (start && end && start >= end)
    ) {
      throw new Error("Invalid date range.");
    }
    where.Date = {
      ...(start ? { gte: start } : {}),
      ...(end ? { lt: end } : {}),
    };
  } else if (query.filter) {
    if (typeof query.filter !== "string")
      throw new Error("Invalid date range.");
    const parts = query.filter.split(",");
    if (parts.length !== 2) throw new Error("Invalid date range.");
    const start = new Date(parts[0]);
    const end = new Date(parts[1]);
    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start > end
    ) {
      throw new Error("Invalid date range.");
    }
    end.setDate(end.getDate() + 1);
    where.Date = { gte: start, lt: end };
  }
  return where;
}

router.get("/", async (req, res, next) => {
  const clientId = Number(req.query.clientId);
  if (!Number.isInteger(clientId) || clientId <= 0) {
    return res.status(400).json({ error: "Invalid client ID." });
  }
  let where;
  try {
    where = { ...taskScope(req.user), ...taskFilter(req.query), clientId };
    if (req.user.role !== "ADMIN" || req.query.includeHidden !== "true")
      where.deleted = false;
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    res.send(await prisma.task.findMany({ where, orderBy: { Date: "desc" } }));
  } catch (error) {
    next(error);
  }
});

router.get("/latest", verifyToken, async (req, res, next) => {
  let where;
  try {
    where = { ...taskScope(req.user), ...taskFilter(req.query) };
    const deleted = req.query.deleted || "undeleted";
    if (deleted === "undeleted") where.deleted = false;
    else if (deleted === "deleted") where.deleted = true;
    else if (deleted !== "none") throw new Error("Invalid deletion filter.");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    res.send(await prisma.task.findMany({ where, orderBy: { Date: "desc" } }));
  } catch (error) {
    next(error);
  }
});
// get a single tasks
router.get("/:id", async function (req, res, next) {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid task ID." });
  try {
    const task = await prisma.task.findFirst({
      where: { id, ...taskScope(req.user) },
    });
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.send(task);
  } catch (error) {
    next(error);
  }
});

// delete a tasks 000000
router.delete("/:id", async function (req, res, next) {
  if (req.user.role !== "ADMIN")
    return res.status(403).json({ error: "Administrator access required." });
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid task ID." });
  try {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return res.status(404).json({ error: "Task not found." });
    res.send(
      await prisma.task.update({
        where: { id },
        data: { deleted: !task.deleted },
      })
    );
  } catch (error) {
    next(error);
  }
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
  if (!Number.isInteger(Number(taskId)) || Number(taskId) <= 0)
    return res.status(400).json({ error: "Invalid task ID." });
  if (typeof name !== "string" || !name.trim())
    return res.status(400).json({ error: "A client name is required." });
  name = name.trim();
  if (
    distance !== "" &&
    distance != null &&
    (!Number.isInteger(Number(distance)) || Number(distance) < 0)
  )
    return res
      .status(400)
      .json({ error: "Distance must be a non-negative whole number." });
  distance = distance === "" || distance == null ? null : Number(distance);
  supplyFile = supplyFile == null ? "" : supplyFile.toString();
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
    const existingTask = await prisma.task.findFirst({
      where: { id: Number(taskId), ...taskScope(req.user) },
    });
    if (!existingTask)
      return res.status(404).json({ error: "Task not found." });
    if (
      existingTask.deleted ||
      (req.user.role !== "ADMIN" && existingTask.status)
    ) {
      return res.status(403).json({ error: "This task cannot be edited." });
    }
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
        if (!client2 || client2.id == client.id) {
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
      taskData.Date = providedDate;
    }
    taskData.supplyFile = supplyFile;
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
      data: {
        ...allowedTaskData(taskData),
        ...(taskData.dateStart !== undefined
          ? { dateStart: taskData.dateStart }
          : {}),
        ...(taskData.Date !== undefined ? { Date: taskData.Date } : {}),
        ...(taskData.endTask !== undefined
          ? { endTask: taskData.endTask }
          : {}),
        ...(taskData.followupBool !== undefined
          ? { followupBool: taskData.followupBool }
          : {}),
        supplyFile,
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
