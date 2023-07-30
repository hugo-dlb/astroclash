import { State, useStore } from "../store/store";
import { Ranking } from "../types/types";
import { axios } from "../utils/axios";
import { getComputedRanking } from "../utils/ranking";

export type GetProfileResponse = {
    data: State & {
        ranks: {
            ranking: Ranking[];
            pastRanking: Ranking[];
        }
    };
};

export const getProfile = () => axios.get<GetProfileResponse>(`/api/auth/profile`).then(response => response.data.data).then(data => {
    useStore.setState({
        ...data,
        ranks: getComputedRanking(data.ranks.ranking, data.ranks.pastRanking)
    });
});