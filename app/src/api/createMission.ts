import { Mission } from "../types/types";
import { axios } from "../utils/axios";

type CreateMissionResponse = {
    data: Mission[];
}

export type CreateMissionProps = {
    label: string;
    fleetUids: string[];
    sourcePlanetUid: string;
    targetPlanetUid: string;
}

export const createMission = (props: CreateMissionProps) => {
    const { label, fleetUids, sourcePlanetUid, targetPlanetUid } = props;

    return axios.post<CreateMissionResponse>(`/api/missions`, {
        label,
        fleetUids,
        sourcePlanetUid,
        targetPlanetUid
    }).then(response => response.data.data);
};