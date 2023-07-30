/*
  Warnings:

  - You are about to drop the column `cost` on the `Fleet` table. All the data in the column will be lost.
  - You are about to drop the column `count` on the `Fleet` table. All the data in the column will be lost.
  - Made the column `planetUid` on table `Building` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `nextLevelCost` to the `Fleet` table without a default value. This is not possible if the table is not empty.
  - Made the column `planetUid` on table `Fleet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `userUid` on table `Planet` required. This step will fail if there are existing NULL values in that column.
  - Made the column `planetUid` on table `Resource` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY');

-- DropForeignKey
ALTER TABLE "Building" DROP CONSTRAINT "Building_planetUid_fkey";

-- DropForeignKey
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_planetUid_fkey";

-- DropForeignKey
ALTER TABLE "Planet" DROP CONSTRAINT "Planet_userUid_fkey";

-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_planetUid_fkey";

-- AlterTable
ALTER TABLE "Building" ALTER COLUMN "planetUid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Fleet" DROP COLUMN "cost",
DROP COLUMN "count",
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "nextLevelCost" INTEGER NOT NULL,
ADD COLUMN     "rarity" "Rarity" NOT NULL DEFAULT 'COMMON',
ALTER COLUMN "planetUid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Planet" ALTER COLUMN "userUid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "planetUid" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Planet" ADD CONSTRAINT "Planet_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
