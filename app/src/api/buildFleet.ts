import { Fleet, FleetType } from "../types/types";
import { axios } from "../utils/axios";

type BuildFleetResponse = {
    data: Fleet;
}

type BuildFleetProps = {
    planetUid: string;
    fleetType: FleetType;
}

export const buildFleet = (props: BuildFleetProps) => {
    const { planetUid, fleetType } = props;

    return axios.post<BuildFleetResponse>(`/api/planets/${planetUid}/fleet`, {
        type: fleetType
    }).then(response => response.data.data);
};