import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { InferType, object, string, array } from "yup";
import { bodyValidationMiddleware } from "../utils/dataValidation";
import { executeMission, getMissionDuration, getUserMissions } from "../utils/mission";
import { Coordinates, MessageType, Planet } from "@prisma/client";
import { addSeconds, differenceInSeconds, isBefore } from "date-fns";
import { prisma } from "../middlewares/prismaMiddleware";
import { addResourcesToPlanet } from "../utils/resource";
import { sendMessage } from "../utils/message";

const router = Router();

router.get('/missions', authMiddleware, async (req: Request, res: Response) => {
    const { user } = req;

    const missions = await getUserMissions(user.userUid, true);
    const missionsToBeDeleted = [];

    for (const mission of missions) {
        const isIncoming = mission.target.userUid === user.userUid;
        const hasReachedDestination = isBefore(new Date(mission.arrivalTime), new Date());
        const hasReturned = !isIncoming && isBefore(new Date(mission.returnTime!), new Date());

        if (isIncoming) {
            if (!hasReachedDestination) {
                continue;
            }

            const defenderFleet = await prisma.fleet.findMany({
                where: {
                    planetUid: mission.targetUid
                }
            });

            await executeMission(mission.uid, mission.source.userUid, mission.target.userUid, mission.fleet, defenderFleet);
            continue;
        }

        if (hasReturned) {
            if (mission.resources.length > 0) {
                addResourcesToPlanet(mission.sourceUid, mission.resources[0].value);
            }
            missionsToBeDeleted.push(mission);

            const messageContent = `${mission.fleet.length} spaceship${mission.fleet.length === 0 ? '' : 's'} returned from planet ${mission.target.name}${mission.resources.length > 0 ? ` with ${mission.resources[0].value} crystal` : ''}.`;
            await sendMessage(user.userUid, MessageType.MissionReturn, messageContent, mission.returnTime!);
            continue;
        }

        if (hasReachedDestination) {
            if (mission.cancelled) {
                continue;
            }

            const defenderFleet = await prisma.fleet.findMany({
                where: {
                    planetUid: mission.targetUid,
                    missionUid: null
                }
            });

            await executeMission(mission.uid, mission.source.userUid, mission.target.userUid, mission.fleet, defenderFleet);
        }
    }

    if (missionsToBeDeleted.length > 0) {
        await prisma.mission.deleteMany({
            where: {
                uid: {
                    in: missionsToBeDeleted.map(mission => mission.uid)
                }
            }
        });
    }

    return res.json({
        data: {
            missions: await getUserMissions(user.userUid)
        }
    });
});

const createMissionValidator = object({
    label: string().required(),
    fleetUids: array().of(string().required()).required(),
    sourcePlanetUid: string().required(),
    targetPlanetUid: string().required()
});

router.post('/missions', authMiddleware, bodyValidationMiddleware(createMissionValidator), async (req: Request<object, object, InferType<typeof createMissionValidator>>, res: Response) => {
    const { prisma, body, user } = req;
    const { label, fleetUids, sourcePlanetUid, targetPlanetUid } = body;

    const sourcePlanet = await prisma.planet.findFirstOrThrow({
        where: {
            uid: sourcePlanetUid,
            userUid: user.userUid
        },
        include: {
            coordinates: true
        }
    }) as Planet & { coordinates: Coordinates };

    const targetPlanet = await prisma.planet.findFirstOrThrow({
        where: {
            uid: targetPlanetUid,
        },
        include: {
            coordinates: true
        }
    }) as Planet & { coordinates: Coordinates };

    const fleet = await prisma.fleet.findMany({
        where: {
            uid: {
                in: fleetUids
            },
            mission: { is: null },
            planetUid: sourcePlanet.uid
        }
    });

    if (fleet.length !== fleetUids.length) {
        return res.status(400).json({ error: "The selected spaceships are no longer available on the planet." });
    }

    const duration = getMissionDuration(sourcePlanet.coordinates, targetPlanet.coordinates, fleet) * 1000;

    await prisma.mission.create({
        data: {
            label,
            type: "ATTACK",
            sourceUid: sourcePlanet.uid,
            targetUid: targetPlanet.uid,
            fleet: {
                connect: fleetUids.map(uid => ({ uid }))
            },
            arrivalTime: new Date(new Date().getTime() + duration),
            returnTime: new Date(new Date().getTime() + duration * 2)
        }
    });

    const missions = await prisma.mission.findMany({
        where: {
            OR: [{
                source: {
                    userUid: user.userUid
                }
            }, {
                target: {
                    userUid: user.userUid
                }
            }]
        },
        include: {
            fleet: true,
            source: {
                include: {
                    coordinates: true
                }
            },
            target: {
                include: {
                    coordinates: true
                }
            }
        }
    });

    return res.json({
        data: missions
    });
});

router.delete('/missions/:missionUid', authMiddleware, async (req: Request<{ missionUid?: string }>, res: Response) => {
    const { prisma, params, user } = req;
    const { missionUid } = params;

    if (!missionUid) {
        return res.status(400).json({ error: "Missing mission uid" });
    }

    const mission = await prisma.mission.findFirstOrThrow({
        where: {
            uid: missionUid,
        },
        include: {
            source: {
                include: {
                    coordinates: true
                }
            },
            target: {
                include: {
                    coordinates: true
                }
            },
            fleet: true
        }
    });

    if (mission.source.userUid !== user.userUid) {
        // in reality the mission exists but we don't want to give too much information
        return res.status(404).json({ error: "Mission not found" });
    }

    const hasReachedDestination = isBefore(new Date(mission.arrivalTime), new Date());
    if (mission.cancelled || hasReachedDestination) {
        return res.status(400).json({ error: "This mission is already on its way back" });
    }

    const timeElapsed = differenceInSeconds(new Date(), mission.createdAt);

    await prisma.mission.update({
        where: {
            uid: mission.uid
        },
        data: {
            returnTime: addSeconds(new Date(), timeElapsed),
            cancelled: true
        }
    });

    return res.json({
        data: await getUserMissions(user.userUid)
    });
});

export { router as missionRouter };