-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "missionUid" UUID;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_missionUid_fkey" FOREIGN KEY ("missionUid") REFERENCES "Mission"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
