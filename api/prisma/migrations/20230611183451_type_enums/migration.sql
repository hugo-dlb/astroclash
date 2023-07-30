/*
  Warnings:

  - Changed the type of `type` on the `Building` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Fleet` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Resource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('CRYSTAL');

-- CreateEnum
CREATE TYPE "FleetType" AS ENUM ('LIGHT_FIGHTER');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('CRYSTAL_MINE', 'SPACE_DOCK');

-- AlterTable
ALTER TABLE "Building" DROP COLUMN "type",
ADD COLUMN     "type" "BuildingType" NOT NULL;

-- AlterTable
ALTER TABLE "Fleet" DROP COLUMN "type",
ADD COLUMN     "type" "FleetType" NOT NULL;

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "type",
ADD COLUMN     "type" "ResourceType" NOT NULL;
