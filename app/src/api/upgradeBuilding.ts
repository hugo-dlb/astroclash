import { Building } from "../types/types";
import { axios } from "../utils/axios";

type UpgradeBuildingResponse = {
    data: Building;
}

type UpgradeBuildingProps = {
    buildingUid: string;
}

export const upgradeBuilding = (props: UpgradeBuildingProps) => {
    const { buildingUid } = props;

    return axios.post<UpgradeBuildingResponse>(`/api/buildings/${buildingUid}/upgrade`).then(response => response.data.data);
};