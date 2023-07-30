import { Fleet } from "../types/types";
import { axios } from "../utils/axios";

type UpgradeBuildingResponse = {
    data: Fleet;
}

type UpgradeFleetProps = {
    planetUid: string;
    fleetUid: string;
}

export const upgradeFleet = (props: UpgradeFleetProps) => {
    const { planetUid, fleetUid } = props;

    return axios.post<UpgradeBuildingResponse>(`/api/planets/${planetUid}/fleet/${fleetUid}/upgrade`).then(response => response.data.data);
};