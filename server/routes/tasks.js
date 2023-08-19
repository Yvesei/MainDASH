var express = require("express");
var router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/", function (req, res, next) {
  const { take, skip, clientId } = req.query;
  if (clientId) {
    // Handle fetching articles by user ID
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
    // Handle fetching all articles
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
    .then((articles) => res.send(articles));
});
// get a single articles
router.get("/:id", function (req, res, next) {
  prisma.article
    .findUnique({ where: { id: +req.params.id } })
    .then((article) => res.send(article));
});

//post a new articles
// assign the articles to categories
router.post("/", function (req, res, next) {
  const { titre, contenu, image, published, categories } = req.body;
  const userId = req.body.userId;

  prisma.article
    .create({
      data: {
        titre,
        contenu,
        image,
        published,
        userId,
        categories: {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        },
      },
      include: {
        categories: true,
      },
    })
    .then((article) => res.send(article))
    .catch((err) => res.send(err));
});

// delete a articles
router.delete("/:id", function (req, res, next) {
  prisma.article
    .delete({ where: { id: +req.params.id } })
    .then((article) => res.send(article));
});

//modify a acticles
router.patch("/", function (req, res, next) {
  prisma.article
    .update({
      where: {
        id: parseInt(req.body.id),
      },
      data: req.body,
    })
    .then((article) => res.send(article));
});

module.exports = router;

/* GET articles listing. */
// router.get('/', function(req, res, next) {
//   const { take, skip } = req.query; // Extract take and skip from query parameters
//   prisma.article.findMany({
//     take: parseInt(take) || undefined,
//     skip: parseInt(skip) || undefined,
//   }).then(articles => res.send(articles))
// });

// router.get('/', function(req, res, next) {
//   const userId = parseInt(req.query.userId);
//   prisma.article.findMany({
//     where: {
//       userId: userId,
//     },
//     include: {
//       categories: true,
//     },
//   })
//     .then(articles => res.send(articles))
//     .catch(error => next(error));
// });
