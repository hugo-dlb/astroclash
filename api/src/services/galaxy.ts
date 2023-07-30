import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { Coordinates } from "@prisma/client";

const router = Router();

type ExtendedUser = {
    uid: string;
    username: string;
    rank: {
        userUid: string;
        username: string;
        rank: number;
        points: number;
    }
}

type ExtendedPlanet = {
    user: ExtendedUser;
    coordinates: Coordinates;
    uid: string;
    name: string;
    lastActivity: Date;
    variant: number;
}

router.get('/galaxy', authMiddleware, async (req: Request<object, object, object, { x?: string, y?: string, xOverscan?: string, yOverscan?: string }>, res: Response) => {
    const { prisma, query } = req;
    const { x, y, xOverscan, yOverscan } = query;

    if (x === undefined || y === undefined || xOverscan === undefined || yOverscan === undefined) {
        return res.status(400).json({ error: "Missing coordinates or overscan" });
    }

    const xOverscanNumber = Number.parseInt(xOverscan, 10);
    const yOverscanNumber = Number.parseInt(yOverscan, 10);

    if (xOverscanNumber > 5 || yOverscanNumber > 5) {
        return res.status(400).json({ error: "If you'd try not to scrap the whole galaxy that'd be great thanks" });
    }

    const planets = await prisma.planet.findMany({
        select: {
            uid: true,
            name: true,
            lastActivity: true,
            variant: true,
            coordinates: {
                select: {
                    uid: true,
                    x: true,
                    y: true,
                    z: true,
                    xOffset: true,
                    yOffset: true
                }
            },
            user: {
                select: {
                    uid: true,
                    username: true,
                }
            }
        },
        where: {
            coordinates: {
                x: {
                    gte: Number.parseInt(x, 10) - xOverscanNumber,
                    lte: Number.parseInt(x, 10) + xOverscanNumber
                },
                y: {
                    gte: Number.parseInt(y, 10) - yOverscanNumber,
                    lte: Number.parseInt(y, 10) + yOverscanNumber
                }
            }
        }
    }) as ExtendedPlanet[];

    const userUids = planets.map(planet => planet.user.uid);
    const userRanks = await prisma.ranking.findMany({
        select: {
            rank: true,
            points: true,
            username: true,
            userUid: true,
        },
        where: {
            userUid: {
                in: userUids
            }
        }
    });

    for (const planet of planets) {
        planet.user.rank = userRanks.find(rank => rank.userUid === planet.user.uid)!;
    }

    res.json({
        data: planets
    });
});

export { router as galaxyRouter };