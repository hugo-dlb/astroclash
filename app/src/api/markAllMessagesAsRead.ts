import { axios } from "../utils/axios";

export const markAllMessagesAsRead = () => axios.post(`/api/messages/markAllAsRead`);