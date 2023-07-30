-- DropForeignKey
ALTER TABLE "Fleet" DROP CONSTRAINT "Fleet_missionUid_fkey";

-- AlterTable
ALTER TABLE "Fleet" ALTER COLUMN "missionUid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_missionUid_fkey" FOREIGN KEY ("missionUid") REFERENCES "Mission"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
