import { Fleet } from "../types/types";
import { axios } from "../utils/axios";

export type GetFleetResponse = {
    data: Fleet[]
};


type GetFleetProps = {
    planetUid: string;
};

export const getFleet = (props: GetFleetProps) => {
    const { planetUid } = props;

    return axios.get<GetFleetResponse>(`/api/planets/${planetUid}/fleet`).then(response => response.data.data);
};