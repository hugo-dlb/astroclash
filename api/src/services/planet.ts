import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { InferType, object, string } from "yup";
import { bodyValidationMiddleware } from "../utils/dataValidation";

const router = Router();

const updateNameValidator = object({
    name: string().required().max(20)
});

router.post('/planets/:planetUid/updateName', authMiddleware, bodyValidationMiddleware(updateNameValidator), async (req: Request<{ planetUid?: string }, object, InferType<typeof updateNameValidator>>, res: Response) => {
    const { prisma, params, body, user } = req;
    const { planetUid } = params;
    const { name } = body;
    const trimmedName = name.trim();

    if (!planetUid) {
        return res.status(400).json({ error: "Missing planet uid" });
    }

    if (trimmedName.length === 0 || trimmedName.length > 20) {
        return res.status(400).json({ error: "The planet name must contain between 1 and 20 characters" });
    }

    const planets = await prisma.planet.findMany({
        where: {
            userUid: user.userUid
        }
    });

    if (planets.find(planet => planet.uid === planetUid) === undefined) {
        return res.status(404).json({ error: "Planet not found" });
    }

    if (planets.find(planet => planet.name === name) !== undefined) {
        return res.status(400).json({ error: "A planet with this name already exists" });
    }

    const planet = await prisma.planet.update({
        where: {
            uid: planetUid,
        },
        data: {
            name
        }
    });

    res.json({
        data: planet
    });
});

export { router as planetRouter };