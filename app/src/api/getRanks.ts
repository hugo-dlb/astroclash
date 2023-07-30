import { Ranking } from "../types/types";
import { axios } from "../utils/axios";
import { getComputedRanking } from "../utils/ranking";

export type GetRanksResponse = {
    data: {
        ranking: Ranking[];
        pastRanking: Ranking[];
    }
};

export const getRanks = () => axios.get<GetRanksResponse>(`/api/ranks`).then(response => response.data.data).then(data => {
    const { ranking, pastRanking } = data;

    return getComputedRanking(ranking, pastRanking);
});