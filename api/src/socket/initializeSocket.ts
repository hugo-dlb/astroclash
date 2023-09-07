import { Server, Socket } from "socket.io";
import { parseCookies } from "../utils/cookie";
import { prisma } from "../middlewares/prismaMiddleware";
import cookieParser from "cookie-parser";
import { Event } from "./types";

export const sockets: Record<string, Socket> = {};

export const initializeSocket = (socket: Server) => {
    socket.on('connection', async (client: Socket) => {
        const cookies = parseCookies(client.handshake.headers.cookie || '');
        const signedSessionId = cookies['connect.sid'];
        const sid = cookieParser.signedCookie(decodeURIComponent(signedSessionId), process.env.SESSION_SECRET!);

        if (!sid) {
            return client.disconnect();
        }

        const userSession = await prisma.userSession.findFirst({
            where: {
                sid
            }
        });

        if (!userSession) {
            return client.disconnect();
        }

        client.data.userUid = (userSession.sess as { user: { userUid: string } }).user.userUid as string;
        sockets[client.data.userUid] = client;

        console.log('socket connection from user', client.data.userUid);

        client.on('disconnect', () => {
            delete sockets[client.data.userUid];
        });
    });

    return socket;
};

export const sendSocketEvent = (event: Event, userUid: string) => {
    const socket = sockets[userUid];

    if (!socket) {
        console.error(`could not find socket with uid ${userUid}: undelivered message of type ${event.type} containing data ${JSON.stringify(event.data)}`);
        return;
    }

    socket.emit("event", event);
};