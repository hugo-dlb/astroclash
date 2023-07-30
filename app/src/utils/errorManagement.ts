import { AxiosError } from "axios";

export const extractErrorMessageFromXHR = (error: unknown) => {
    if (error instanceof AxiosError) {
        return error.response?.data?.error || "A technical error occured. Please refresh the page and try again";
    }

    return "A technical error occured. Please refresh the page and try again";
};