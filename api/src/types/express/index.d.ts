import { PrismaClient } from '@prisma/client';

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
            user: RequestUser;
        }
    }
}