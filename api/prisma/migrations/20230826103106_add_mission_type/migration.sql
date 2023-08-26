/*
  Warnings:

  - Added the required column `type` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MissionType" AS ENUM ('ATTACK', 'TRANSPORT');

-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "type" "MissionType" NOT NULL;
