import { MessageType } from "@prisma/client";
import { prisma } from "../middlewares/prismaMiddleware";
import { Mission } from "../types/Mission";

export const sendMessage = async (userUid: string, type: MessageType, mission: Mission, content: string, createdAt?: Date) => {
    await prisma.message.create({
        data: {
            userUid,
            type,
            content,
            createdAt: createdAt || new Date(),
            updatedAt: createdAt || new Date()
        }
    });

    // sendSocketEvent({
    //     type,
    //     data: {
    //         mission,
    //         message,
    //     }
    // }, userUid);
};