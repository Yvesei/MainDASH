const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const AdminUsers = prisma.user
  .create({
    data: {
      name: "admin",
      email: "admin",
      password: "admin",
      role: "ADMIN",
    },
  })
  .catch((error) => {
    console.error(error);
  });
