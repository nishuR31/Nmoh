import { PrismaClient } from "../generated/prisma/index.js";

const userClient = new PrismaClient({
  accelerateUrl: process.env.USER_DB,
});

// Test connection and handle initialization errors
// userClient
//   .$connect()
//   .then(() => {
//     console.log("User Prisma Client connected successfully");
//   })
//   .catch((error) => {
//     console.error("Failed to connect User Prisma Client:", error.message);
//     console.error("Make sure to run: npx prisma generate && npx prisma migrate deploy");
//     process.exit(1);
//   });

// Handle graceful shutdown
process.on("SIGINT", async () => {
  await userClient.$disconnect();
  console.log("User Prisma Client disconnected");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await userClient.$disconnect();
  console.log("User Prisma Client disconnected");
  process.exit(0);
});

export default userClient;
