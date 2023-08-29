import { Request, Response, Router } from "express";

const router = Router();

router.post('/messages/:messageUid/read', async (req: Request, res: Response) => {
    const { prisma } = req;

    // TODO: mark message as read
});

export { router as messageRouter };