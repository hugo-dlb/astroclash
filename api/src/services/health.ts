import { Request, Response, Router } from "express";

const router = Router();

router.get('/health', async (req: Request, res: Response) => {
    const { prisma } = req;

    try {
        await prisma.user.findMany();

        res.json({
            data: {
                status: "OK"
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            data: {
                status: "KO"
            }
        });
    }
});

export { router as healthRouter };