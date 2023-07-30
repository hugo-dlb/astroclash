import axios from "axios";
import { extractErrorMessageFromXHR } from "./errorManagement";
import { toast } from "./toast";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL
});

const errorHandler = (error: unknown) => {
    toast({
        title: "Error",
        description: extractErrorMessageFromXHR(error),
        status: "error",
        duration: 10000,
        isClosable: true
    });

    return Promise.reject(error);
};

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => errorHandler(error)
);

export { axiosInstance as axios };