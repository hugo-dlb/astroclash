import { Message, MessageType } from "@prisma/client";
import { Mission } from "../types/Mission";

export type Event = {
    type: MessageType,
    data: {
        mission: Mission,
        message: Message,
    }
}