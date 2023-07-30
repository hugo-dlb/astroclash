import { NextFunction, Request, Response } from "express";
import { ObjectSchema, ValidationError } from "yup";

export const bodyValidationMiddleware = (schema: ObjectSchema<any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        await schema.validate(req.body);
        next();
    } catch (error: unknown) {
        if (error instanceof ValidationError) {
            res.status(400).json({
                error: error.message
            })
        } else {
            console.error(JSON.stringify(error));
            res.status(500).json({
                error: "A technical error occured. please try again later."
            })
        }
    }
}