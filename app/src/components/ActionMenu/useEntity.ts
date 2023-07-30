import { EntityType, Planet } from "../../types/types";

export const useReactiveEntity = (planet: Planet, uid: string, type: EntityType) => {
    const fleet = planet.fleet.find(fleet => fleet.uid === uid);
    const building = planet.buildings.find(building => building.uid === uid);
    const resource = planet.resources.find(resource => resource.uid === uid);

    if (type === EntityType.FLEET) {
        return fleet!;
    }

    if (type === EntityType.BUILDING) {
        return building!;
    }

    if (type === EntityType.RESOURCE) {
        return resource!;
    }

    return undefined;
};