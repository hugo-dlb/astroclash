/*
  Warnings:

  - Added the required column `returnTime` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "returnTime" TIMESTAMP(0) NOT NULL;
