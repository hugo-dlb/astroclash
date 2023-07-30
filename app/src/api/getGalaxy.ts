import { Coordinates } from "../types/types";
import { axios } from "../utils/axios";

type ExtendedUser = {
    uid: string;
    username: string;
    rank: {
        userUid: string;
        username: string;
        rank: number;
        points: number;
    }
}

export type ExtendedPlanet = {
    user: ExtendedUser;
    coordinates: Coordinates;
    uid: string;
    name: string;
    lastActivity: string;
    variant: number;
}

type GetGalaxyResponse = {
    data: ExtendedPlanet[];
};

type GetGalaxyProps = {
    x: number;
    y: number;
    xOverscan: number;
    yOverscan: number;
};

export const getGalaxy = (props: GetGalaxyProps) => {
    const { x, y, xOverscan, yOverscan } = props;

    return axios.get<GetGalaxyResponse>(`/api/galaxy?x=${x}&y=${y}&xOverscan=${xOverscan}&yOverscan=${yOverscan}`).then(response => response.data.data);
};