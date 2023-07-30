import { ResourceType } from "../types/types";

export const getResourceLabel = (type: ResourceType) => {
    switch (type) {
        case ResourceType.CRYSTAL:
            return "Crystal";
        default:
            return "Unknown resource";
    }
};

export const getResourceImage = (type: ResourceType) => {
    switch (type) {
        case ResourceType.CRYSTAL:
            return "crystal.png";
        default:
            return "";
    }
};