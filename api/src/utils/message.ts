import { MessageType } from "@prisma/client";
import { prisma } from "../middlewares/prismaMiddleware";

export const sendMessage = async (userUid: string, type: MessageType, content: string, createdAt?: Date) => {
    await prisma.message.create({
        data: {
            userUid,
            type,
            content,
            createdAt: createdAt || new Date(),
            updatedAt: createdAt || new Date()
        }
    });
};