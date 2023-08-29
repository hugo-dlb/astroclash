import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getPlanetResource } from "../utils/planet";
import { bodyValidationMiddleware } from "../utils/dataValidation";
import { InferType, mixed, object } from "yup";
import { generateRarity } from "../utils/rarity";
import { FleetType } from "@prisma/client";
import { spendResources, updatePlanetsResources } from "../utils/resource";
import { getFleetScrapNumber, getFleetTypeCost, getFleetUpgradeCost } from "../utils/fleet";

const router = Router();

router.get('/planets/:planetUid/fleet', authMiddleware, async (req: Request, res: Response) => {
    const { prisma, user, params } = req;
    const { planetUid } = params;

    if (!planetUid) {
        return res.status(400).json({ error: "Missing planet uid" });
    }

    const planet = await prisma.planet.findFirstOrThrow({
        where: {
            userUid: user.userUid,
            uid: planetUid
        },
        include: {
            fleet: true
        }
    });

    res.json({
        data: planet.fleet
    });
});

const createFleetValidator = object({
    type: mixed<FleetType>().oneOf(Object.values(FleetType))
        .required()
});

router.post('/planets/:planetUid/fleet', authMiddleware, bodyValidationMiddleware(createFleetValidator), async (req: Request<{ planetUid?: string }, object, InferType<typeof createFleetValidator>>, res: Response) => {
    const { prisma, body, params, user } = req;
    const { type } = body;
    const { planetUid } = params;

    if (!planetUid) {
        return res.status(400).json({ error: "Missing planet uid" });
    }

    await updatePlanetsResources(user.userUid);

    const planet = await prisma.planet.findFirstOrThrow({
        where: {
            userUid: user.userUid,
            uid: planetUid
        },
        include: {
            resources: true
        }
    });

    const resource = getPlanetResource(planet);
    const resourcesAvailable = resource.value;
    const cost = getFleetTypeCost(type);

    if (cost > resourcesAvailable) {
        return res.status(400).json({ error: "Insufficient resources. Please refresh the page and try again" });
    }

    await spendResources(planetUid, cost);

    const fleet = await prisma.fleet.create({
        data: {
            planetUid,
            type,
            rarity: generateRarity(),
        }
    });

    res.json({
        data: fleet
    });
});

router.delete('/planets/:planetUid/fleet/:fleetUid', authMiddleware, async (req: Request<{ planetUid?: string, fleetUid?: string }>, res: Response) => {
    const { prisma, params, user } = req;
    const { planetUid, fleetUid } = params;

    if (!planetUid) {
        return res.status(400).json({ error: "Missing planet uid" });
    }

    if (!fleetUid) {
        return res.status(400).json({ error: "Missing fleet uid" });
    }

    const fleet = await prisma.fleet.findFirstOrThrow({
        where: {
            uid: fleetUid,
            planetUid,
            mission: {
                is: null
            }
        },
        include: {
            planet: {
                include: {
                    resources: true
                }
            }
        }
    });

    if (fleet.planet.userUid !== user.userUid) {
        return res.status(403).json({ error: "You don't have permission to access this resource" });
    }

    const deletedFleet = await prisma.fleet.delete({
        where: {
            uid: fleetUid
        }
    });

    await prisma.resource.update({
        where: {
            uid: getPlanetResource(fleet.planet).uid
        },
        data: {
            value: getPlanetResource(fleet.planet).value + getFleetScrapNumber(fleet)
        }
    });

    res.json({
        data: deletedFleet
    });
});

router.post('/planets/:planetUid/fleet/:fleetUid/upgrade', authMiddleware, async (req: Request<{ planetUid?: string, fleetUid?: string }>, res: Response) => {
    const { prisma, params, user } = req;
    const { planetUid, fleetUid } = params;

    if (!planetUid) {
        return res.status(400).json({ error: "Missing planet uid" });
    }

    if (!fleetUid) {
        return res.status(400).json({ error: "Missing fleet uid" });
    }

    const fleet = await prisma.fleet.findFirstOrThrow({
        where: {
            uid: fleetUid,
            planetUid,
            mission: {
                is: null
            }
        },
        include: {
            planet: {
                include: {
                    resources: true
                }
            }
        }
    });

    const planet = await prisma.planet.findFirstOrThrow({
        where: {
            userUid: user.userUid,
            uid: planetUid
        },
        include: {
            resources: true
        }
    });

    if (fleet.planet.userUid !== user.userUid) {
        return res.status(403).json({ error: "You don't have permission to access this resource" });
    }

    const resource = getPlanetResource(planet);
    const resourcesAvailable = resource.value;
    const cost = getFleetUpgradeCost(fleet.type, fleet.level + 1);

    if (cost > resourcesAvailable) {
        return res.status(400).json({ error: "Insufficient resources. Please refresh the page and try again" });
    }

    await spendResources(planetUid, cost);

    const updatedFleet = await prisma.fleet.update({
        where: {
            uid: fleet.uid
        },
        data: {
            level: fleet.level + 1,
            rarity: generateRarity()
        }
    });

    res.json({
        data: updatedFleet
    });
});

export { router as fleetRouter };