-- CreateTable
CREATE TABLE "Coordinates" (
    "uid" UUID NOT NULL DEFAULT gen_random_uuid(),
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "z" INTEGER NOT NULL,
    "spiralProgress" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "planetUid" UUID NOT NULL,

    CONSTRAINT "Coordinates_pkey" PRIMARY KEY ("uid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coordinates_planetUid_key" ON "Coordinates"("planetUid");

-- AddForeignKey
ALTER TABLE "Coordinates" ADD CONSTRAINT "Coordinates_planetUid_fkey" FOREIGN KEY ("planetUid") REFERENCES "Planet"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
