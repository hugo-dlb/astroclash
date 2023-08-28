import { isBefore } from "date-fns";
import { Mission } from "../../types/types";
import { formatDuration } from "../../utils/date";

export const getMissionFormattedDuration = (mission: Mission, isIncoming: boolean, now: Date) => {
    const hasReachedDestination = isBefore(new Date(mission.arrivalTime), new Date());

    if (isIncoming) {
        return hasReachedDestination ? "Done" : formatDuration(
            Math.floor(
                (now.getTime() -
                    new Date(mission.arrivalTime).getTime()) /
                1000
            )
        );
    }

    const hasReturned = isBefore(new Date(mission.returnTime!), new Date());

    return hasReturned ? "Done" : formatDuration(
        Math.floor(
            (now.getTime() -
                new Date((hasReachedDestination || mission.cancelled) ? mission.returnTime! : mission.arrivalTime).getTime()) /
            1000
        )
    );
};