import { Coordinates, Fleet } from "../types/types";
import { getSlowestFleetSpeed } from "./fleet";

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