import { Mission as PrismaMission } from "@prisma/client";

export type Mission = Omit<PrismaMission, "returnTime"> & {
    returnTime?: Date;
};