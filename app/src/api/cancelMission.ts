import { Mission } from "../types/types";
import { axios } from "../utils/axios";

type CancelMissionResponse = {
    data: Mission[];
}

export type CancelMissionProps = {
    missionUid: string;
}

export const cancelMission = (props: CancelMissionProps) => {
    const { missionUid } = props;

    return axios.delete<CancelMissionResponse>(`/api/missions/${missionUid}`).then(response => response.data.data);
};