import { NextFunction, Request, Response } from "express";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.session.user;

    if (!user) {
        return res.status(403).json({ error: "Unauthenticated user" });
    }

    req.user = user;

    next();
};