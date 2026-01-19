import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx ts-node prisma/seed.ts", // points to the seed script
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
