import { Fleet } from "../types/types";
import { axios } from "../utils/axios";

type ScrapFleetResponse = {
    data: Fleet;
}

type ScrapFleetProps = {
    planetUid: string;
    fleetUid: string;
}

export const scrapFleet = (props: ScrapFleetProps) => {
    const { planetUid, fleetUid } = props;

    return axios.delete<ScrapFleetResponse>(`/api/planets/${planetUid}/fleet/${fleetUid}`).then(response => response.data.data);
};