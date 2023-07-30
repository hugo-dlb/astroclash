-- CreateTable
CREATE TABLE "Planet" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "variant" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Planet_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Resource" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "planetUid" UUID,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Fleet" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "cost" INTEGER NOT NULL,
    "planetUid" UUID,

    CONSTRAINT "Fleet_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "Building" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "nextLevelCost" INTEGER NOT NULL,
    "production" INTEGER NOT NULL,
    "planetUid" UUID,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("uid")
);

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fleet" ADD CONSTRAINT "Fleet_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
