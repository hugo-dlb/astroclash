-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('MissionResult', 'MissionReturn');

-- CreateTable
CREATE TABLE "Message" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" "MessageType" NOT NULL,
    "content" TEXT NOT NULL,
    "userUid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
