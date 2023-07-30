import { Request, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getBuildingCost, getCrystalMineProduction } from "../utils/building";
import { getPlanetResource } from "../utils/planet";
import { spendResources, updatePlanetsResources } from "../utils/resource";

const router = Router();

router.post('/buildings/:buildingUid/upgrade', authMiddleware, async (req: Request<{ buildingUid?: string }>, res) => {
    const { prisma, params, user } = req;
    const { buildingUid } = params;

    if (!buildingUid) {
        return res.status(400).json({ error: "Missing building uid" });
    }

    await updatePlanetsResources(user.userUid);

    const building = await prisma.building.findFirstOrThrow({
        where: {
            uid: buildingUid,
        },
        include: {
            planet: {
                include: {
                    resources: true
                }
            }
        }
    });

    if (building.planet.userUid !== user.userUid) {
        return res.status(403).json({ error: "You don't have permission to access this resource" });
    }

    const cost = getBuildingCost(building.type, building.level + 1);
    const resource = getPlanetResource(building.planet);
    const resourcesAvailable = resource.value;

    if (cost > resourcesAvailable) {
        return res.status(400).json({ error: "Insufficient resources. Please refresh the page and try again" });
    }

    await spendResources(building.planet.uid, cost);

    const updatedBuilding = await prisma.building.update({
        where: {
            uid: buildingUid
        },
        data: {
            level: building.level + 1,
            production: getCrystalMineProduction(building.level + 1)
        }
    });

    res.json({
        data: updatedBuilding
    });
});

export { router as buildingRouter };