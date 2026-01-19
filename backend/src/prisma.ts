import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();


