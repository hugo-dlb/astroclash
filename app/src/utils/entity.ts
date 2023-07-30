import { Entity, isBuilding, isFleet, isExtendedPlanet, isResource } from "../types/types";
import { getBuildingLabel } from "./building";
import { getFleetExtendedLabel } from "./fleet";
import { getResourceLabel } from "./resource";

export const getEntityLabel = (entity: Entity) => {
    if (isBuilding(entity)) {
        return getBuildingLabel(entity.type);
    }

    if (isFleet(entity)) {
        return getFleetExtendedLabel(entity);
    }

    if (isResource(entity)) {
        return getResourceLabel(entity.type);
    }

    if (isExtendedPlanet(entity)) {
        return entity.name;
    }

    return (`Unknown entity ${JSON.stringify(entity)}`);
};