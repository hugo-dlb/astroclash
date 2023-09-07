import { PrismaClient } from '@prisma/client';
import { Server } from 'socket.io';

export type RequestUser = {
    userUid: string;
}

declare module "express-session" {
    export interface SessionData {
        user: RequestUser;
    }
}

declare global {
    namespace Express {
        export interface Request {
            prisma: PrismaClient;
            socket: Server;
            user: RequestUser;
        }
    }
}