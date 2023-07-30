import { Fleet, Planet, Mission as PrismaMission } from "@prisma/client";

export type Mission = Omit<PrismaMission, "returnTime"> & {
    returnTime?: Date;
    fleet: Fleet[];
    source: Planet;
    target: Planet;
}