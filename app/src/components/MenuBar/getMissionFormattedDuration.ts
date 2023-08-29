import { isBefore } from "date-fns";
import { Mission } from "../../types/types";

export const getMissionTimeLeft = (mission: Mission, isIncoming: boolean, now: Date) => {
    const hasReachedDestination = isBefore(new Date(mission.arrivalTime), new Date());

    if (isIncoming) {
        return hasReachedDestination ? 0 :
            Math.floor(
                (now.getTime() -
                    new Date(mission.arrivalTime).getTime()) /
                1000
            );
    }

    const hasReturned = isBefore(new Date(mission.returnTime!), new Date());

    return hasReturned ? 0 :
        Math.floor(
            ((new Date((hasReachedDestination || mission.cancelled) ? mission.returnTime! : mission.arrivalTime).getTime()) - now.getTime()) / 1000
        );
};