import { Coordinates, Fleet, Planet } from "@prisma/client";
import { getFleetLootNumber, getSlowestFleetSpeed } from "./fleet";
import { prisma } from "../middlewares/prismaMiddleware";
import { Mission } from "../types/Mission";
import { executeBattle } from "./battle";

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

export const getUserMissions = async (userUid: string) => {
    const missions: Mission[] = await prisma.mission.findMany({
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
    const filteredMissions = missions.filter(mission => {
        return (mission.target.userUid !== userUid) || (mission.arrivalTime >= now);
    });

    for (const mission of filteredMissions) {
        if (mission.target.userUid === userUid) {
            // hide the arrival time for incoming attacks
            delete mission.returnTime;
        }
    }

    return filteredMissions;
};

const executeMission = (source: Planet, target: Planet, attackerFleet: Fleet[], defenderFleet: Fleet[]) => {
    const {
        defenderRemainingFleet,
        attackerRemainingFleet,
        defenderLostFleet,
        attackerLostFleet
    } = executeBattle(defenderFleet, attackerFleet);

    let resourcesLoot = 0;
    for (const fleet of defenderLostFleet) {
        resourcesLoot += getFleetLootNumber(fleet);
    }
    for (const fleet of attackerLostFleet) {
        resourcesLoot += getFleetLootNumber(fleet);
    }

    // TODO: distribute loot to winner (or both somehow if the outcome of the battle is a draw)
};