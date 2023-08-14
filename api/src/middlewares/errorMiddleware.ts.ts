import { NextFunction, Request, Response } from "express";

export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: 'A technical error occured. Please try again later' });
};

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    if (req.headers.accept?.includes("application/json")) {
        res.status(500).send({ error: 'A technical error occured. Please refresh the page and try again' });
    } else {
        next(err);
    }
};