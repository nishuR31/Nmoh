import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// config({ path: path.join(__dirname, "menu.env")});
config({ path: path.join(__dirname, "..", "back.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("MENU_DB"),
  },
});
