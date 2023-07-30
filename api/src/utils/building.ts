import { Building, BuildingType, Planet, ResourceType } from "@prisma/client";

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

export const getResourceBuilding = (planet: Planet & { buildings: Building[] }, resourceType: ResourceType) => {
    const building = planet.buildings.find(building => building.type.toString() === `${resourceType}_MINE`);

    if (!building) {
        throw new Error(`Unknown resource ${resourceType}`);
    }

    return building;
};