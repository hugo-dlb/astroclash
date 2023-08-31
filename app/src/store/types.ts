import { login } from "../api/login";
import { logout } from "../api/logout";
import { Building, ComputedRanking, EntityReference, EntityType, FleetType, Mission, Planet, User } from "../types/types";
import { register } from "../api/register";
import { getProfile } from "../api/getProfile";
import { ExtendedPlanet } from "../api/getGalaxy";

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
    updatePlanetName: (planetUid: string, name: string) => void;
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
    getFleet: (planetUid: string) => Promise<void>;
    createMission: (label: string, fleetUids: string[], sourcePlanetUid: string, targetPlanetUid: string) => Promise<void>;
    cancelMission: (missionUid: string) => Promise<void>;
    markMessageAsRead: (messageUid: string) => void;
    markAllMessagesAsRead: () => void;
}