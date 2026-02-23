import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: "../../backend/.env" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    provider: "mongodb",
    url: process.env.USER_DB
  }
});