import { Rarity } from "@prisma/client";

export const generateRarity = (): Rarity => {
    const number = Math.random() * 100;

    if (number >= 35) { // 65%
        return "COMMON";
    }

    if (number >= 10) { // 25%
        return "UNCOMMON";
    }

    if (number >= 1) { // 9%
        return "RARE";
    }

    if (number >= 0.1) { // 0.9%
        return "EPIC";
    }

    return "LEGENDARY"; // 0.1%
};

export const getRarityMultiplier = (rarity: Rarity) => {
    switch (rarity) {
        case "COMMON":
            return 1;
        case "UNCOMMON":
            return 2;
        case "RARE":
            return 5;
        case "EPIC":
            return 10;
        case "LEGENDARY":
            return 20;
    }
};