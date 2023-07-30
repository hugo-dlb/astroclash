-- AlterTable
ALTER TABLE "Planet" ADD COLUMN     "userUid" UUID;

-- AddForeignKey
ALTER TABLE "Planet" ADD CONSTRAINT "Planet_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
