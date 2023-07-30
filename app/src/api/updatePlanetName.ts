import { Planet } from "../types/types";
import { axios } from "../utils/axios";

type BuildFleetResponse = {
    data: Planet;
}

type UpdatePlanetNameProps = {
    planetUid: string;
    name: string;
}

export const updatePlanetName = (props: UpdatePlanetNameProps) => {
    const { planetUid, name } = props;

    return axios.post<BuildFleetResponse>(`/api/planets/${planetUid}/updateName`, {
        name,
    }).then(response => response.data.data);
};