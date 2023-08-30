import { Request, Response, Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post('/messages/:messageUid/read', authMiddleware, async (req: Request<{ messageUid?: string }>, res: Response) => {
    const { prisma, params, user } = req;
    const { messageUid } = params;

    if (!messageUid) {
        return res.status(400).json({ error: "Missing message uid" });
    }

    // verify message ownership
    await prisma.message.findFirstOrThrow({
        where: {
            uid: messageUid,
            userUid: user.userUid,
        }
    });

    const message = await prisma.message.update({
        where: {
            uid: messageUid,
        },
        data: {
            read: true
        }
    });

    res.json({
        data: message
    });
});

router.post('/messages/markAllAsRead', authMiddleware, async (req: Request, res: Response) => {
    const { prisma, user } = req;

    const messages = await prisma.message.updateMany({
        where: {
            userUid: user.userUid,
            read: false
        },
        data: {
            read: true
        }
    });

    res.json({
        data: messages
    });
});

export { router as messageRouter };