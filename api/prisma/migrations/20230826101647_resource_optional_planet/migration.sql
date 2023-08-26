-- DropForeignKey
ALTER TABLE "Resource" DROP CONSTRAINT "Resource_planetUid_fkey";

-- AlterTable
ALTER TABLE "Resource" ALTER COLUMN "planetUid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
