const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const active = { OR: [{ deleted: false }, { deleted: null }] };

// The summary endpoint supplies counts in one query instead of one request per row.
router.get("/", async (req, res, next) => {
  try {
    const take =
      req.query.take === undefined ? undefined : Number(req.query.take);
    const skip =
      req.query.skip === undefined ? undefined : Number(req.query.skip);
    if (
      (take !== undefined && (!Number.isInteger(take) || take < 1)) ||
      (skip !== undefined && (!Number.isInteger(skip) || skip < 0))
    ) {
      return res.status(400).json({ error: "Invalid pagination." });
    }
    const clients = await prisma.client.findMany({
      where: req.query.includeHidden === "true" ? {} : active,
      take,
      skip,
      orderBy: { name: "asc" },
    });
    if (req.query.summary !== "true" || !clients.length)
      return res.json(clients);
    const groups = await prisma.task.groupBy({
      by: ["clientId", "status"],
      where: {
        deleted: false,
        clientId: { in: clients.map((client) => client.id) },
        ...(req.user && req.user.role !== "ADMIN"
          ? { createdBy: req.user.id }
          : {}),
      },
      _count: { _all: true },
      _max: { Date: true },
    });
    const counts = new Map();
    for (const group of groups) {
      const count = counts.get(group.clientId) || {
        taskCount: 0,
        pendingCount: 0,
        latestTaskDate: null,
      };
      count.taskCount += group._count._all;
      if (group.status !== true) count.pendingCount += group._count._all;
      const latest = group._max?.Date;
      if (latest && (!count.latestTaskDate || latest > count.latestTaskDate))
        count.latestTaskDate = latest;
      counts.set(group.clientId, count);
    }
    res.json(
      clients.map((client) => ({
        ...client,
        ...(counts.get(client.id) || {
          taskCount: 0,
          pendingCount: 0,
          latestTaskDate: null,
        }),
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/countAll", async (req, res, next) => {
  try {
    res.json({ clientCount: await prisma.client.count({ where: active }) });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid client ID." });
  try {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ error: "Client not found." });
    res.json(client);
  } catch (error) {
    next(error);
  }
});

function clientData(body) {
  if (typeof body.name !== "string" || !body.name.trim())
    throw new Error("A client name is required.");
  if (body.name.trim().length > 191)
    throw new Error("The client name is too long.");
  if (
    body.number != null &&
    (typeof body.number !== "string" || body.number.length > 191)
  )
    throw new Error("Invalid phone number.");
  if (
    body.image != null &&
    (typeof body.image !== "string" ||
      !/^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/.test(body.image))
  )
    throw new Error("Invalid image name.");
  let distance = null;
  if (body.distance !== "" && body.distance != null) {
    distance = Number(body.distance);
    if (!Number.isInteger(distance) || distance < 0 || distance > 2147483647)
      throw new Error("Distance must be a non-negative whole number.");
  }
  return {
    name: body.name.trim(),
    number: body.number?.trim() || null,
    distance,
    ...(typeof body.image === "string" ? { image: body.image } : {}),
  };
}

function clientError(error, res, next) {
  if (error.code === "P2002")
    return res
      .status(409)
      .json({ error: "A client with that name already exists." });
  if (error.code === "P2025")
    return res.status(404).json({ error: "Client not found." });
  return next(error);
}

router.post("/", async (req, res, next) => {
  let data;
  try {
    data = clientData(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    res.status(201).json(await prisma.client.create({ data }));
  } catch (error) {
    clientError(error, res, next);
  }
});

router.delete("/:id", async (req, res, next) => {
  if (req.user?.role !== "ADMIN")
    return res.status(403).json({ error: "Administrator access required." });
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid client ID." });
  try {
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) return res.status(404).json({ error: "Client not found." });
    res.json(
      await prisma.client.update({
        where: { id },
        data: { deleted: !client.deleted },
      })
    );
  } catch (error) {
    next(error);
  }
});

router.patch("/", async (req, res, next) => {
  const id = Number(req.body.id);
  if (!Number.isInteger(id) || id <= 0)
    return res.status(400).json({ error: "Invalid client ID." });
  let data;
  try {
    data = clientData(req.body);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
  try {
    res.json(await prisma.client.update({ where: { id }, data }));
  } catch (error) {
    clientError(error, res, next);
  }
});
module.exports = router;
