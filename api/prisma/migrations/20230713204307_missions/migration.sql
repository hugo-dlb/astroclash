/*
  Warnings:

  - Added the required column `missionUid` to the `Fleet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Fleet" ADD COLUMN     "missionUid" UUID NOT NULL;

-- CreateTable
CREATE TABLE "Mission" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "label" TEXT,
    "sourceUid" UUID NOT NULL,
    "targetUid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_missionUid_fkey" FOREIGN KEY ("missionUid") REFERENCES "Mission"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_sourceUid_fkey" FOREIGN KEY ("sourceUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_targetUid_fkey" FOREIGN KEY ("targetUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
