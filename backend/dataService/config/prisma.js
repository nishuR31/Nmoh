import { PrismaClient } from "../generated/prisma/index.js";

const dataClient = new PrismaClient();

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await dataClient.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await dataClient.$disconnect();
  process.exit(0);
});

export default dataClient;
