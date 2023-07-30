import { Building, BuildingType } from "../types/types";

export const getBuildingLabel = (type: BuildingType) => {
    switch (type) {
        case BuildingType.CRYSTAL_MINE:
            return "Crystal Extractor";
        case BuildingType.SPACE_DOCK:
            return "Space Dock";
        default:
            return "Unknown Building";
    }
};

export const getBuildingImage = (type: BuildingType) => {
    switch (type) {
        case BuildingType.CRYSTAL_MINE:
            return "crystal_mine.png";
        case BuildingType.SPACE_DOCK:
            return "space_dock.png";
        default:
            return "";
    }
};

export const getBuildingResourceType = (building: Building) => {
    return building.type.toString().split("_")[0];
};

export const getCrystalMineProduction = (level: number, serverSpeed = 2) => Math.floor(30 * serverSpeed * level * Math.pow(1.1, level));

export const getBuildingCost = (buildingType: BuildingType, level: number) => {
    switch (buildingType) {
        case BuildingType.CRYSTAL_MINE:
            return getCrystalMineCost(level);
        case BuildingType.SPACE_DOCK:
            return getSpaceDockCost(level);
        default:
            return 0;
    }
};

export const getCrystalMineCost = (level: number) => Math.floor(60 * Math.pow(1.5, level - 1));

export const getSpaceDockCost = (level: number) => Math.floor(50 * level * Math.pow(2, level - 1));

export const getSpaceDockSpace = (level: number) => level * 2 + level;