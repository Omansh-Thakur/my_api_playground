-- BackfillTable
UPDATE "Project" SET "createdAt" = CURRENT_TIMESTAMP WHERE "createdAt" IS NULL;
