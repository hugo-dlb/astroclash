import { Coordinates, Fleet, MessageType, Planet, Resource } from "@prisma/client";
import { getFleetLootNumber, getFleetValue, getSlowestFleetSpeed } from "./fleet";
import { prisma } from "../middlewares/prismaMiddleware";
import { Mission } from "../types/Mission";
import { executeBattle } from "./battle";
import { addResourcesToPlanet, removeResourcesFromPlanet, updatePlanetResources } from "./resource";
import { sendMessage } from "./message";

const MINIMUM_TRAVEL_TIME = 10 * 60;
const BASE_SPEED = 50;

export const getMissionDuration = (sourceCoordinates: Coordinates, targetCoordinates: Coordinates, fleet: Fleet[]) => {
    const xDifference = Math.abs(sourceCoordinates.x - targetCoordinates.x);
    const yDifference = Math.abs(sourceCoordinates.y - targetCoordinates.y);
    const slowestFleetSpeed = getSlowestFleetSpeed(fleet);

    if (slowestFleetSpeed === undefined) {
        return 0;
    }

    const speedRatio = slowestFleetSpeed / BASE_SPEED;
    const distance = Math.sqrt((Math.pow(xDifference, 2) + Math.pow(yDifference, 2)));

    return MINIMUM_TRAVEL_TIME + Math.ceil((distance * 30) / speedRatio);
};

type MissionWithOptionalReturnTime = Mission & {
    resources: Resource[];
    fleet: Fleet[];
    source: Planet;
    target: Planet;
    returnTime?: Date;
}

export const getUserMissions = async (userUid: string, isInternal = false) => {
    const missions: MissionWithOptionalReturnTime[] = await prisma.mission.findMany({
        where: {
            OR: [{
                source: {
                    userUid
                }
            }, {
                target: {
                    userUid
                }
            }]
        },
        include: {
            resources: true,
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
            },
        }
    });

    const now = new Date();

    // hide the incoming attacks after they reached their target
    const filteredMissions = isInternal ? missions : missions.filter(mission => {
        return (mission.target.userUid !== userUid) || (!mission.cancelled && mission.arrivalTime >= now);
    });

    for (const mission of filteredMissions) {
        if (mission.target.userUid === userUid) {
            // hide the arrival time for incoming attacks
            delete mission.returnTime;
        }
    }

    return filteredMissions;
};

const deleteMission = async (mission: { uid: string } & {
    resources: { uid: string }[]
}) => {
    if (mission.resources.length > 1) {
        await prisma.resource.delete({
            where: {
                uid: mission.resources[0].uid
            }
        });
    }

    await prisma.mission.delete({
        where: {
            uid: mission.uid
        }
    });
};

const updateMissionResources = async (missionUid: string, resources: number) => {
    await prisma.mission.update({
        where: {
            uid: missionUid
        },
        data: {
            resources: {
                create: {
                    type: "CRYSTAL",
                    value: resources,
                }
            }
        }
    });
};

const updateRankingAfterBattle = async (attackerUserUid: string, attackerLostFleet: Fleet[], defenderUserUid: string, defenderLostFleet: Fleet[]) => {
    if (attackerLostFleet.length > 1) {
        await prisma.rank.update({
            where: {
                userUid: attackerUserUid
            },
            data: {
                points: {
                    decrement: getFleetValue(attackerLostFleet)
                }
            }
        });
    }

    if (defenderLostFleet.length > 1) {
        await prisma.rank.update({
            where: {
                userUid: defenderUserUid
            },
            data: {
                points: {
                    decrement: getFleetValue(defenderLostFleet)
                }
            }
        });
    }
};

export const executeMission = async (missionUid: string, attackerUserUid: string, defenderUserUid: string, attackerFleet: Fleet[], defenderFleet: Fleet[]) => {
    const {
        defenderRemainingFleet,
        attackerRemainingFleet,
        defenderLostFleet,
        attackerLostFleet
    } = executeBattle(defenderFleet, attackerFleet);
    let missionDeleted = false;

    const mission = await prisma.mission.findFirstOrThrow({
        where: {
            uid: missionUid
        },
        include: {
            resources: true
        }
    });

    // destroy lost fleet from both sides
    await prisma.fleet.deleteMany({
        where: {
            uid: {
                in: [...defenderLostFleet.map(fleet => fleet.uid), ...attackerLostFleet.map(fleet => fleet.uid)]
            }
        }
    });

    let resourcesLoot = 0;
    for (const fleet of defenderLostFleet) {
        resourcesLoot += getFleetLootNumber(fleet);
    }
    for (const fleet of attackerLostFleet) {
        resourcesLoot += getFleetLootNumber(fleet);
    }

    const attackerWon = defenderRemainingFleet.length === 0 && attackerRemainingFleet.length > 0;
    const defenderWon = attackerRemainingFleet.length === 0 && defenderRemainingFleet.length > 0;

    if (attackerWon) {
        const targetPlanet = await prisma.planet.findFirstOrThrow({
            where: {
                uid: mission.targetUid
            },
            include: {
                resources: true,
                buildings: true
            }
        });

        const updatedPlanetResources = await updatePlanetResources(targetPlanet);
        const planetLoot = Math.floor(updatedPlanetResources / 2);
        resourcesLoot += planetLoot;
        await updateMissionResources(mission.uid, resourcesLoot);
        await removeResourcesFromPlanet(mission.targetUid, planetLoot);

        let messageContent = `The attacker won the battle! ${planetLoot} crystal have been stolen from planet ${targetPlanet.name}.`;
        if (defenderLostFleet.length > 0) {
            messageContent += ` The defender lost ${defenderLostFleet.length} spaceships.`;
        }
        if (attackerLostFleet.length > 0) {
            messageContent += ` The attacker lost ${defenderLostFleet.length} spaceships.`;
        }
        await sendMessage(attackerUserUid, MessageType.MissionResult, messageContent);
    } else if (defenderWon) {
        await addResourcesToPlanet(mission.targetUid, resourcesLoot);
        await deleteMission(mission);
        missionDeleted = true;

        let messageContent = `The defender won the battle! ${resourcesLoot} crystal have been recovered from the destroyed fleet debris.`;
        if (defenderLostFleet.length > 0) {
            messageContent += ` The defender lost ${defenderLostFleet.length} spaceships.`;
        }
        if (attackerLostFleet.length > 0) {
            messageContent += ` The attacker lost ${defenderLostFleet.length} spaceships.`;
        }
        await sendMessage(attackerUserUid, MessageType.MissionResult, messageContent);
    } else {
        await updateMissionResources(mission.uid, Math.round(resourcesLoot / 2));
        await addResourcesToPlanet(mission.targetUid, Math.round(resourcesLoot / 2));

        let messageContent = `The battle ended in a draw! Both the attacker and the defender recovered ${Math.round(resourcesLoot / 2)} crystal from the destroyed fleet debris.`;
        if (defenderLostFleet.length > 0) {
            messageContent += ` The defender lost ${defenderLostFleet.length} spaceships.`;
        }
        if (attackerLostFleet.length > 0) {
            messageContent += ` The attacker lost ${defenderLostFleet.length} spaceships.`;
        }
        await sendMessage(attackerUserUid, MessageType.MissionResult, messageContent);
    }

    await updateRankingAfterBattle(attackerUserUid, attackerLostFleet, defenderUserUid, defenderLostFleet);

    return missionDeleted;
};