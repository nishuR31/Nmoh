import { PrismaClient } from "../generated/prisma/index.js";
// import { PrismaClient } from "@prisma/client";

const menuClient = new PrismaClient();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await menuClient.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await menuClient.$disconnect();
  process.exit(0);
});

export default menuClient;
