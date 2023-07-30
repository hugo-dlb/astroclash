import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export const prisma = new PrismaClient();

export const prismaMiddleware = (req: Request, res: Response, next: NextFunction) => {
    req.prisma = prisma;
    next();
};