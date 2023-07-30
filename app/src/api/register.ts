import { User } from "../types/types";
import { axios } from "../utils/axios";

type RegisterResponse = {
    data: User;
}

type RegisterProps = {
    username: string;
    email: string;
    password: string;
}

export const register = (props: RegisterProps) => {
    const { username, email, password } = props;

    return axios.post<RegisterResponse>(`/api/auth/register`, {
        username,
        email,
        password
    }).then(response => response.data);
};