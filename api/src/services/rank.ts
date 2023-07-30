import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get('/ranks', authMiddleware, async (req: Request, res: Response) => {
    const { prisma } = req;

    const ranking = await prisma.ranking.findMany({
        select: {
            rank: true,
            points: true,
            username: true,
            userUid: true,
        }
    });
    const pastRanking = await prisma.pastRanking.findMany({
        select: {
            rank: true,
            points: true,
            username: true,
            userUid: true,
        }
    });

    res.json({
        data: {
            ranking,
            pastRanking
        }
    });
});

export { router as rankRouter };