/*
  Warnings:

  - Added the required column `xOffset` to the `Coordinates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `yOffset` to the `Coordinates` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coordinates" ADD COLUMN     "xOffset" INTEGER NOT NULL,
ADD COLUMN     "yOffset" INTEGER NOT NULL;
