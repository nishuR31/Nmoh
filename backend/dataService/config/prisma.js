import { PrismaClient } from "../generated/prisma/index.js";

const eventClient = new PrismaClient();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await eventClient.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await eventClient.$disconnect();
  process.exit(0);
});

export default eventClient;
