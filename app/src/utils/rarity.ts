import { Rarity } from "../types/types";

export const getRarityColor = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return "whiteAlpha.100";
        case Rarity.UNCOMMON:
            return "blue.500";
        case Rarity.RARE:
            return "red.500";
        case Rarity.EPIC:
            return "purple.500";
        case Rarity.LEGENDARY:
            return "#f6ff00";
    }
};

export const getRarityLevel = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return 0;
        case Rarity.UNCOMMON:
            return 1;
        case Rarity.RARE:
            return 2;
        case Rarity.EPIC:
            return 3;
        case Rarity.LEGENDARY:
            return 4;
    }
};

export const getRarityBackgroundColor = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return "whiteAlpha.200";
        case Rarity.UNCOMMON:
            return "#3182ce57";
        case Rarity.RARE:
            return "#e53e3e57";
        case Rarity.EPIC:
            return "#805ad552";
        case Rarity.LEGENDARY:
            return "#f6ff0057";
    }
};

export const getRarityBackgroundHoverColor = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return "whiteAlpha.200";
        case Rarity.UNCOMMON:
            return "#3182ce94";
        case Rarity.RARE:
            return "#e53e3ea3";
        case Rarity.EPIC:
            return "#805ad596";
        case Rarity.LEGENDARY:
            return "#f6ff009c";
    }
};

export const getRarityLabel = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return "Common";
        case Rarity.UNCOMMON:
            return "Uncommon";
        case Rarity.RARE:
            return "Rare";
        case Rarity.EPIC:
            return "Epic";
        case Rarity.LEGENDARY:
            return "Legendary";
    }
};

export const getRarityMultiplier = (rarity: Rarity) => {
    switch (rarity) {
        case Rarity.COMMON:
            return 1;
        case Rarity.UNCOMMON:
            return 2;
        case Rarity.RARE:
            return 5;
        case Rarity.EPIC:
            return 10;
        case Rarity.LEGENDARY:
            return 20;
    }
};