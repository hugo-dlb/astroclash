import { State, useStore } from "../store/store";
import { Ranking } from "../types/types";
import { axios } from "../utils/axios";
import { getComputedRanking } from "../utils/ranking";

type LoginResponse = {
    data: State & {
        ranks: {
            ranking: Ranking[];
            pastRanking: Ranking[];
        }  
    };
}

type LoginProps = {
    email: string;
    password: string;
}

export const login = (props: LoginProps) => {
    const { email, password } = props;

    return axios.post<LoginResponse>(`/api/auth/login`, {
        email,
        password
    }).then(response => response.data.data).then(data => {
        useStore.setState({
            ...data,
            ranks: getComputedRanking(data.ranks.ranking, data.ranks.pastRanking)
        });
    });
};