/*
  Warnings:

  - Added the required column `arrivalTime` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "arrivalTime" TIMESTAMP(0) NOT NULL;
