import { Building, Planet, Resource } from "@prisma/client";
import { prisma } from "../middlewares/prismaMiddleware";
import { getResourceBuilding } from "./building";
import { getPlanetResource } from "./planet";

export const INITIAL_CRYSTAL_AMOUNT = 500;

export const updatePlanetResources = async (planet: Planet & {
    buildings: Building[];
    resources: Resource[];
}) => {
    const resource = getPlanetResource(planet);
    const secondsSinceLastUpdate = Math.floor((Date.now() - planet.lastResourceUpdate.getTime()) / 1000);

    if (secondsSinceLastUpdate === 0) {
        return resource.value;
    }

    const production = getResourceBuilding(planet, "CRYSTAL").production;
    const resourcesToBeAdded = Math.floor((production / 3600) * secondsSinceLastUpdate);

    if (resourcesToBeAdded === 0) {
        return resource.value;
    }

    await prisma.resource.update({
        where: {
            uid: resource.uid,
        },
        data: {
            value: resource.value + resourcesToBeAdded
        }
    });

    await prisma.planet.update({
        where: {
            uid: planet.uid,
        },
        data: {
            lastActivity: new Date(),
            lastResourceUpdate: new Date()
        },
    });

    return resource.value + resourcesToBeAdded;
};

export const updatePlanetsResources = async (userUid: string) => {
    const planets = await prisma.planet.findMany({
        where: {
            userUid,
        },
        include: {
            buildings: true,
            resources: true
        }
    });

    for (const planet of planets) {
        await updatePlanetResources(planet);
    }
};

export const addResourcesToPlanet = async (planetUid: string, resourcesToBeAdded: number) => {
    const target = await prisma.planet.findFirstOrThrow({
        where: {
            uid: planetUid

        },
        include: {
            resources: true
        }
    });
    const resource = getPlanetResource(target);

    await prisma.resource.update({
        where: {
            uid: resource.uid
        },
        data: {
            value: resource.value + resourcesToBeAdded
        }
    });
};

export const removeResourcesFromPlanet = async (planetUid: string, resourcesToBeRemoved: number) => {
    const target = await prisma.planet.findFirstOrThrow({
        where: {
            uid: planetUid

        },
        include: {
            resources: true
        }
    });
    const resource = getPlanetResource(target);

    await prisma.resource.update({
        where: {
            uid: resource.uid
        },
        data: {
            value: resource.value - resourcesToBeRemoved
        }
    });
};

export const spendResources = async (planetUid: string, cost: number) => {
    const planet = await prisma.planet.findFirstOrThrow({
        where: {
            uid: planetUid
        },
        include: {
            resources: true
        }
    });

    const resource = getPlanetResource(planet);

    if (resource.value < cost) {
        throw new Error("Insufficient resources. Please refresh the page and try again.");
    }

    await prisma.resource.update({
        where: {
            uid: resource.uid
        },
        data: {
            value: resource.value - cost
        }
    });

    await prisma.rank.update({
        where: {
            userUid: planet.userUid
        },
        data: {
            points: {
                increment: cost
            }
        }
    });
};