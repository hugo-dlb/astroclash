import { prisma } from "../middlewares/prismaMiddleware";
import { getResourceBuilding } from "./building";
import { getPlanetResource } from "./planet";

export const INITIAL_CRYSTAL_AMOUNT = 500;

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
        const secondsSinceLastUpdate = Math.floor((Date.now() - planet.lastResourceUpdate.getTime()) / 1000);

        if (secondsSinceLastUpdate === 0) {
            continue;
        }

        const resource = getPlanetResource(planet);
        const production = getResourceBuilding(planet, "CRYSTAL").production;
        const resourcesToBeAdded = Math.floor((production / 3600) * secondsSinceLastUpdate);

        if (resourcesToBeAdded === 0) {
            continue;
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
    }
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