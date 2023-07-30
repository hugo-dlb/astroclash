import { defaultState, useStore } from "../store/store";
import { axios } from "../utils/axios";

export const logout = () => axios.post(`/api/auth/logout`).then(() => {
    useStore.setState({
        ...defaultState
    });
});