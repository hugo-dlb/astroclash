-- CreateTable
CREATE TABLE "Rank" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "points" INTEGER NOT NULL DEFAULT 0,
    "userUid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rank_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Rank_userUid_key" ON "Rank"("userUid");

-- AddForeignKey
ALTER TABLE "Rank" ADD CONSTRAINT "Rank_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "PastRank" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "points" INTEGER NOT NULL DEFAULT 0,
    "userUid" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PastRank_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "PastRank_userUid_key" ON "PastRank"("userUid");

-- AddForeignKey
ALTER TABLE "PastRank" ADD CONSTRAINT "PastRank_userUid_fkey" FOREIGN KEY ("userUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
