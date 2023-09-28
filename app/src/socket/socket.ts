import { io, type Socket } from "socket.io-client";
import { Event } from "../types/types";

let socket: Socket | undefined;

export const initializeSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_BACKEND_BASE_URL, {
            withCredentials: true,
            forceNew: true
        });
    }

    socket.on("event", (event: Event) => {
        // TODO: socket is unused for now
        console.log(event);
    });
};

export const disconnectSocket = () => {
    if (!socket) {
        return;
    }

    socket.disconnect();
    socket = undefined;
};