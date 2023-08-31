import { Fleet, Mission, Planet, ResourceType } from "../types/types";
import { State } from "./types";

export const makeSelectPlanet = (planetUid: string) => (state: State) => {
    const planet = state.planets.find(planet => planet.uid === planetUid);

    if (!planet) {
        throw new Error("Unknown planet");
    }

    return planet;
};

export const selectPlanetResource = (planet: Planet) => {
    return planet.resources.find(resource => resource.type === ResourceType.CRYSTAL)!;
};

export const selectResourceBuilding = (planet: Planet, resourceType: ResourceType) => {
    const building = planet.buildings.find(building => building.type.toString() === `${resourceType}_MINE`);

    if (!building) {
        throw new Error(`Unknown resource ${resourceType}`);
    }

    return building;
};

export const selectBuilding = (planet: Planet, buildingUid: string) => {
    const building = planet.buildings.find(building => building.uid === buildingUid);

    if (!building) {
        throw new Error(`Unknown building with uid ${buildingUid}`);
    }

    return building;
};

export const selectFleet = (planet: Planet, fleetUid: string) => {
    const fleet = planet.fleet.find(fleet => fleet.uid === fleetUid);

    if (!fleet) {
        throw new Error(`Unknown fleet with uid ${fleetUid}`);
    }

    return fleet;
};

export const selectMission = (missions: Mission[], missionUid: string) => {
    const mission = missions.find(mission => mission.uid === missionUid);

    if (!mission) {
        throw new Error(`Unknown mission with uid ${missionUid}`);
    }

    return mission;
};

export const selectFleetWithoutMissions = (fleet: Fleet[], missions: Mission[]) => {
    return fleet
        .filter((fleet) => missions.find((mission) =>
            mission.fleet.find((spaceship) => spaceship.uid === fleet.uid) !== undefined) === undefined)
        .sort((a, b) => b.level - a.level);
};