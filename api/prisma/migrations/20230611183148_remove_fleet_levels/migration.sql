/*
  Warnings:

  - You are about to drop the column `level` on the `Fleet` table. All the data in the column will be lost.
  - You are about to drop the column `nextLevelCost` on the `Fleet` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fleet" DROP COLUMN "level",
DROP COLUMN "nextLevelCost";
