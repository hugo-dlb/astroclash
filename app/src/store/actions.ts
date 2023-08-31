import { login } from "../api/login";
import { logout } from "../api/logout";
import { register } from "../api/register";
import { getProfile } from "../api/getProfile";
import { upgradeFleet } from "../api/upgradeFleet";
import { createMission } from "../api/createMission";
import { cancelMission } from "../api/cancelMission";
import { getMissions } from "../api/getMissions";
import { getFleet } from "../api/getFleet";
import { markMessageAsRead } from "../api/markMessageAsRead";
import { markAllMessagesAsRead } from "../api/markAllMessagesAsRead";
import { getBuildingCost, getCrystalMineProduction } from "../utils/building";
import { upgradeBuilding } from "../api/upgradeBuilding";
import { buildFleet } from "../api/buildFleet";
import { getFleetScrapNumber, getFleetTypeCost, getFleetUpgradeCost } from "../utils/fleet";
import { updatePlanetName } from "../api/updatePlanetName";
import { getRanks } from "../api/getRanks";
import { scrapFleet } from "../api/scrapFleet";
import { makeSelectPlanet, selectPlanetResource, selectResourceBuilding } from "./selectors";
import { Building, BuildingType, EntityReference, FleetType, Planet } from "../types/types";
import { getGalaxy } from "../api/getGalaxy";
import { ActionMenuAction, Actions, State } from "./types";
import { StateCreator } from "zustand";

type test = StateCreator<State & Actions>;

export const getActions = (set: Parameters<test>[0], get: Parameters<test>[1]) => ({
    login,
    logout,
    register,
    getProfile,
    updatePlanetName: async (planetUid: string, name: string) => {
        const planet = await updatePlanetName({
            planetUid,
            name
        });

        const updatedPlanets = JSON.parse(JSON.stringify(get().planets)) as Planet[];
        const planetIndex = updatedPlanets.findIndex(planet => planet.uid === planet.uid);
        updatedPlanets[planetIndex].name = planet.name;

        set({
            planets: updatedPlanets,
        });
    },
    updatePlanetResources: (planetUid: string) => {
        const state = get();
        const planet = makeSelectPlanet(planetUid)(state);
        const planetIndex = state.planets.indexOf(planet);

        const updatedPlanet = JSON.parse(JSON.stringify(planet));
        const resource = selectPlanetResource(updatedPlanet);
        const hourlyProduction = selectResourceBuilding(planet, resource.type).production;
        const productionPerSecond = hourlyProduction / 3600;
        const secondsElapsed = (Date.now() - new Date(planet.lastResourceUpdate).getTime()) / 1001;
        resource.value = resource.value + productionPerSecond * secondsElapsed;
        planet.lastResourceUpdate = Date.now();
        const updatedPlanets = [...state.planets];
        updatedPlanets[planetIndex] = updatedPlanet;

        set(() => ({
            planets: updatedPlanets
        }));
    },
    upgradeBuilding: (buildingParam: Building) => {
        const state = get();
        const planet = state.planets.find(planet => planet.uid === buildingParam.planetUid)!;
        const planetIndex = state.planets.indexOf(planet);

        const updatedPlanet = JSON.parse(JSON.stringify(planet)) as Planet;
        const building = updatedPlanet.buildings.find(building => building.uid === buildingParam.uid)!;
        const resource = selectPlanetResource(updatedPlanet);

        resource.value -= getBuildingCost(building.type, building.level + 1);

        if (building.type === BuildingType.CRYSTAL_MINE) {
            building.production = getCrystalMineProduction(building.level + 1);
        }
        building.level += 1;

        const updatedPlanets = [...state.planets];
        updatedPlanets[planetIndex] = updatedPlanet;

        set(() => ({
            planets: updatedPlanets
        }));

        upgradeBuilding({
            buildingUid: building.uid
        }).then(() => get().getRanks());
    },
    buildFleet: async (planetUid: string, fleetType: FleetType) => {
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
    scrapFleet: async (planetUid: string, fleetUid: string) => {
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
    upgradeFleet: async (planetUid: string, fleetUid: string) => {
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
    openMenu: (action: ActionMenuAction, source: HTMLElement, entity: EntityReference) => {
        const state = get();

        if (state.actionMenu.isOpen && state.actionMenu.source === source) {
            set(() => ({
                actionMenu: {
                    isOpen: false,
                    source: undefined,
                    entity: undefined,
                    action: ActionMenuAction.EMPTY
                }
            }));
            return;
        }

        set(() => ({
            actionMenu: {
                isOpen: true,
                source,
                entity,
                action,
            }
        }));
    },
    closeMenu: () => {
        set(() => ({
            actionMenu: {
                isOpen: false,
                source: undefined,
                entity: undefined,
                action: ActionMenuAction.EMPTY
            }
        }));
    },
    getRanks: async () => {
        const ranks = await getRanks();

        set({
            ranks
        });
    },
    getGalaxy: async (x: number, y: number, xOverscan = 2, yOverscan = 2) => {
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
    getFleet: async (planetUid: string) => {
        const fleet = await getFleet({ planetUid });

        const updatedPlanets = [...get().planets];
        const planetIndex = updatedPlanets.findIndex(planet => planet.uid === planetUid);
        const planet = updatedPlanets[planetIndex];
        const updatedPlanet = {
            ...planet,
            fleet
        };
        updatedPlanets[planetIndex] = updatedPlanet;

        set({
            planets: updatedPlanets
        });
    },
    createMission: async (label: string, fleetUids: string[], sourcePlanetUid: string, targetPlanetUid: string) => {
        const updatedMissions = await createMission({
            label,
            fleetUids,
            sourcePlanetUid,
            targetPlanetUid
        });

        set({
            missions: updatedMissions,
        });
    },
    cancelMission: async (missionUid: string) => {
        const updatedMissions = await cancelMission({
            missionUid
        });

        set({
            missions: updatedMissions,
        });
    },
    markMessageAsRead: (messageUid: string) => {
        markMessageAsRead({
            messageUid
        });

        const state = get();
        const updatedMessages = JSON.parse(JSON.stringify(state.user.messages));
        for (const message of updatedMessages) {
            if (message.uid === messageUid) {
                message.read = true;
            }
        }

        set({
            user: {
                ...state.user,
                messages: updatedMessages
            }
        });
    },
    markAllMessagesAsRead: () => {
        markAllMessagesAsRead();

        const state = get();
        const updatedMessages = JSON.parse(JSON.stringify(state.user.messages));
        for (const message of updatedMessages) {
            message.read = true;
        }

        set({
            user: {
                ...state.user,
                messages: updatedMessages
            }
        });
    }
} as Actions);