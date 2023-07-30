import { Fleet, FleetType, Rarity } from "../types/types";
import { getRarityLabel, getRarityMultiplier } from "./rarity";

export const getFleetLabel = (type: FleetType) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return "Light Fighter";
        default:
            return "Unknown Fleet";
    }
};

export const getFleetImage = (type: FleetType) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return "light_fighter.png";
        default:
            return "";
    }
};

export const getFleetTypeCost = (type: FleetType) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return 200;
        default:
            return 0;
    }
};

export const getFleetScrapNumber = (fleet: Fleet) => {
    switch (fleet.type) {
        case FleetType.LIGHT_FIGHTER:
            return Math.floor(getFleetUpgradeCost(fleet.type, fleet.level) * 0.3);
        default:
            return 0;
    }
};

export const getFleetUpgradeCost = (type: FleetType, level: number) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return Math.floor(getFleetTypeCost(FleetType.LIGHT_FIGHTER) * Math.pow(2, level - 1));
        default:
            return 0;
    }
};

export const getFleetExtendedLabel = (fleet: Fleet) => {
    return `${getFleetLabel(fleet.type)} ${fleet.rarity !== Rarity.COMMON
        ? "(" + getRarityLabel(fleet.rarity) + ")"
        : ""
        }`;
};

export const getFleetHealthPoints = (type: FleetType, level: number, rarity: Rarity) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return Math.floor(10 * Math.pow(1.3, level - 1)) * getRarityMultiplier(rarity);
        default:
            return 0;
    }
};

export const getFleetAttackPoints = (type: FleetType, level: number, rarity: Rarity) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return Math.floor(7 * Math.pow(1.2, level - 1)) * getRarityMultiplier(rarity);
        default:
            return 0;
    }
};

export const getFleetSpeed = (type: FleetType, level: number) => {
    switch (type) {
        case FleetType.LIGHT_FIGHTER:
            return 50 + Math.floor(10 * Math.pow(1.1, level - 1));
        default:
            return 0;
    }
};

export const getSlowestFleetSpeed = (fleet: Fleet[]) => {
    let min;

    for (const spaceship of fleet) {
        const speed = getFleetSpeed(spaceship.type, spaceship.level);
        if (min === undefined || speed < min) {
            min = speed;
        }
    }

    return min;
};