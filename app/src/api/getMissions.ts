import { Mission } from "../types/types";
import { axios } from "../utils/axios";

export type GetMissionsResponse = {
    data: {
        missions: Mission[];
    }
};

export const getMissions = () => axios.get<GetMissionsResponse>(`/api/missions`).then(response => response.data.data.missions);