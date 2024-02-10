const { PrismaClient } = require("@prisma/client");
const { hashPassword } = require("../lib/password");
const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({ where: { email: "admin" } });
  if (existing) {
    console.log("Starter administrator already exists.");
    return;
  }
  await prisma.user.create({
    data: {
      name: "admin",
      email: "admin",
      password: await hashPassword("admin"),
      role: "ADMIN",
      image: "avatar.png",
    },
  });
  console.log(
    "Starter administrator created. Change its password before sharing the app."
  );
}
main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
