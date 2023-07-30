import { create } from "zustand";
import { makeSelectPlanet, selectPlanetResource, selectResourceBuilding } from "./selectors";
import { immer } from 'zustand/middleware/immer';
import { login } from "../api/login";
import { logout } from "../api/logout";
import { Building, BuildingType, ComputedRanking, EntityReference, EntityType, FleetType, Mission, Planet, User } from "../types/types";
import { register } from "../api/register";
import { getProfile } from "../api/getProfile";
import { getBuildingCost, getCrystalMineProduction } from "../utils/building";
import { upgradeBuilding } from "../api/upgradeBuilding";
import { buildFleet } from "../api/buildFleet";
import { getFleetScrapNumber, getFleetTypeCost, getFleetUpgradeCost } from "../utils/fleet";
import { updatePlanetName } from "../api/updatePlanetName";
import { getRanks } from "../api/getRanks";
import { scrapFleet } from "../api/scrapFleet";
import { ExtendedPlanet, getGalaxy } from "../api/getGalaxy";
import { upgradeFleet } from "../api/upgradeFleet";
import { createMission } from "../api/createMission";
import { cancelMission } from "../api/cancelMission";
import { getMissions } from "../api/getMissions";

export enum ActionMenuAction {
    BUILDING_SELECTION = 'BUILDING_SELECTION',
    FLEET_SELECTION = 'FLEET_SELECTION',
    BUILD_FLEET = 'BUILD_FLEET',
    GALAXY_PLANET_SELECTION = 'GALAXY_PLANET_SELECTION',
    EMPTY = 'EMPTY',
    MISSION_SELECTION = 'MISSION_SELECTION',
}

export type State = {
    user: User;
    planets: Planet[];
    actionMenu: {
        isOpen: boolean;
        source?: any; // Immer doesn't like the HTMLElement type
        entity?: EntityReference | ExtendedPlanet;
        action: ActionMenuAction;
    },
    ranks: ComputedRanking[],
    missions: Mission[],
    galaxy: Map<string, ExtendedPlanet[]>
};

export type Actions = {
    login: typeof login;
    logout: typeof logout;
    register: typeof register;
    getProfile: typeof getProfile;
    updatePlanetName: (oldName: string, name: string) => void;
    updatePlanetResources: (planetUid: string, secondsElapsed?: number) => void;
    upgradeBuilding: (buildingParam: Building) => void;
    buildFleet: (planetUid: string, fleetType: FleetType) => void;
    scrapFleet: (planetUid: string, fleetUid: string) => void;
    upgradeFleet: (planetUid: string, fleetUid: string) => void;
    openMenu: (action: ActionMenuAction, source: HTMLElement, entity?: { uid: string; type: EntityType } | ExtendedPlanet) => void;
    closeMenu: () => void;
    getRanks: () => Promise<void>;
    getGalaxy: (x: number, y: number, xOverscan?: number, yOverscan?: number) => Promise<void>;
    getMissions: () => Promise<void>;
    createMission: (label: string, fleetUids: string[], sourcePlanetUid: string, targetPlanetUid: string) => Promise<void>;
    cancelMission: (missionUid: string) => Promise<void>;
}

export const defaultState: State = {
    user: {
        uid: "",
        username: "",
        email: ""
    },
    planets: [],
    actionMenu: {
        isOpen: false,
        action: ActionMenuAction.EMPTY
    },
    ranks: [],
    missions: [],
    galaxy: new Map()
};

export const useStore = create(
    immer<State & Actions>((set, get) => {
        const store: State & Actions = {
            ...defaultState,
            login,
            logout,
            register,
            getProfile,
            updatePlanetName: async (planetUid, name) => {
                const planet = await updatePlanetName({
                    planetUid,
                    name
                });

                const updatedPlanets = JSON.parse(JSON.stringify(get().planets)) as Planet[];
                const planetIndex = updatedPlanets.findIndex(planet => planet.uid === planet.uid);
                updatedPlanets[planetIndex].name = planet.name;
                set({
                    planets: updatedPlanets
                });
            },
            updatePlanetResources: (planetUid) => set((state: State) => {
                const planet = makeSelectPlanet(planetUid)(state);
                const resource = selectPlanetResource(planet);
                const hourlyProduction = selectResourceBuilding(planet, resource.type).production;
                const productionPerSecond = hourlyProduction / 3600;
                const secondsElapsed = (Date.now() - new Date(planet.lastResourceUpdate).getTime()) / 1001;

                resource.value = resource.value + productionPerSecond * secondsElapsed;
                planet.lastResourceUpdate = Date.now();
            }),
            upgradeBuilding: (buildingParam) => set((state: State) => {
                const planet = state.planets.find(planet => planet.uid === buildingParam.planetUid)!;
                const building = planet.buildings.find(building => building.uid === buildingParam.uid)!;
                const resource = selectPlanetResource(planet);

                resource.value -= getBuildingCost(building.type, building.level + 1);

                if (building.type === BuildingType.CRYSTAL_MINE) {
                    building.production = getCrystalMineProduction(building.level + 1);
                }
                building.level += 1;

                upgradeBuilding({
                    buildingUid: building.uid
                }).then(() => get().getRanks());
            }),
            buildFleet: async (planetUid, fleetType) => {
                const fleet = await buildFleet({
                    planetUid,
                    fleetType
                });

                const state = get();
                const updatedPlanets = JSON.parse(JSON.stringify(state.planets)) as Planet[];
                const planet = updatedPlanets.find(planet => planet.uid === planetUid)!;
                const resource = selectPlanetResource(planet);
                const cost = getFleetTypeCost(fleetType);
                resource.value -= cost;
                planet.fleet.push(fleet);

                get().getRanks();

                set({
                    planets: updatedPlanets
                });
            },
            scrapFleet: async (planetUid, fleetUid) => {
                const fleet = await scrapFleet({
                    planetUid,
                    fleetUid
                });

                const state = get();
                const updatedPlanets = JSON.parse(JSON.stringify(state.planets)) as Planet[];
                const planet = updatedPlanets.find(planet => planet.uid === planetUid)!;
                const resource = selectPlanetResource(planet);
                resource.value += getFleetScrapNumber(fleet);
                const fleetIndex = planet.fleet.findIndex(fleet => fleet.uid === fleetUid);
                planet.fleet.splice(fleetIndex, 1);

                get().getRanks();

                // close the menu before updating the state because the fleet will no longer exist
                state.closeMenu();

                set({
                    planets: updatedPlanets
                });
            },
            upgradeFleet: async (planetUid, fleetUid) => {
                const updatedFleet = await upgradeFleet({
                    planetUid,
                    fleetUid
                });

                const state = get();
                const updatedPlanets = JSON.parse(JSON.stringify(state.planets)) as Planet[];
                const planet = updatedPlanets.find(planet => planet.uid === planetUid)!;
                const resource = selectPlanetResource(planet);
                resource.value -= getFleetUpgradeCost(updatedFleet.type, updatedFleet.level);
                const fleetIndex = planet.fleet.findIndex(fleet => fleet.uid === fleetUid);
                planet.fleet[fleetIndex] = updatedFleet;

                get().getRanks();

                set({
                    planets: updatedPlanets
                });
            },
            openMenu: (action, source, entity) => set((state: State) => {
                if (state.actionMenu.isOpen && state.actionMenu.source === source) {
                    state.actionMenu = {
                        isOpen: false,
                        source: undefined,
                        entity: undefined,
                        action: ActionMenuAction.EMPTY
                    };
                    return;
                }

                state.actionMenu = {
                    isOpen: true,
                    source,
                    entity,
                    action,
                };
            }),
            closeMenu: () => set((state: State) => {
                state.actionMenu = {
                    isOpen: false,
                    source: undefined,
                    entity: undefined,
                    action: ActionMenuAction.EMPTY
                };
            }),
            getRanks: async () => {
                const ranks = await getRanks();

                set({
                    ranks
                });
            },
            getGalaxy: async (x, y, xOverscan = 2, yOverscan = 2) => {
                const galaxy = await getGalaxy({ x, y, xOverscan, yOverscan });
                const state = get();

                const updatedGalaxy = new Map([...state.galaxy]);

                for (let j = y - yOverscan; j <= y + yOverscan; j++) {
                    for (let i = x - xOverscan; i <= x + xOverscan; i++) {
                        if (updatedGalaxy.get(`${i}:${j}`) === undefined) {
                            updatedGalaxy.set(`${i}:${j}`, []);
                        }
                    }
                }

                for (const planet of galaxy) {
                    const { x, y } = planet.coordinates;
                    const existingPlanets = updatedGalaxy.get(`${x}:${y}`)!;

                    if (!existingPlanets.some(existingPlanet => existingPlanet.uid === planet.uid)) {
                        updatedGalaxy.get(`${x}:${y}`)!.push(planet);
                    }
                }

                set({
                    galaxy: updatedGalaxy
                });
            },
            getMissions: async () => {
                const missions = await getMissions();

                set({
                    missions
                });
            },
            createMission: async (label, fleetUids, sourcePlanetUid, targetPlanetUid) => {
                const updatedMissions = await createMission({
                    label,
                    fleetUids,
                    sourcePlanetUid,
                    targetPlanetUid
                });

                const updatedPlanets = [...get().planets];
                const planetIndex = updatedPlanets.findIndex(planet => planet.uid === sourcePlanetUid);
                const planet = updatedPlanets[planetIndex];
                const updatedPlanet = {
                    ...planet,
                    fleet: [...planet.fleet.filter(fleet => !fleetUids.includes(fleet.uid))]
                };
                updatedPlanets[planetIndex] = updatedPlanet;

                set({
                    planets: updatedPlanets,
                    missions: updatedMissions,
                });
            },
            cancelMission: async (missionUid) => {
                const updatedMissions = await cancelMission({
                    missionUid
                });

                set({
                    missions: updatedMissions,
                });
            }
        };

        return store;
    })
);