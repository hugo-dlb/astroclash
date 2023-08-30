import { axios } from "../utils/axios";

type MarkMessageAsReadProps = {
    messageUid: string
}

export const markMessageAsRead = (props: MarkMessageAsReadProps) => {
    const { messageUid } = props;

    return axios.post(`/api/messages/${messageUid}/read`);
};