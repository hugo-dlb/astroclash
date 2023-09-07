import { ExtendedPlanet } from "../api/getGalaxy";

export enum ResourceType {
    CRYSTAL = "CRYSTAL"
}

export const isResource = (entity: any): entity is Resource => {
    return entity && entity.type && [
        ResourceType.CRYSTAL,
    ].includes(entity.type);
};

export type Resource = {
    uid: string;
    type: ResourceType;
    value: number;
    planetUid: string;
};

export enum BuildingType {
    CRYSTAL_MINE = "CRYSTAL_MINE",
    SPACE_DOCK = "SPACE_DOCK"
}

export const isBuilding = (entity: any): entity is Building => {
    return entity && entity.type && [
        BuildingType.CRYSTAL_MINE,
        BuildingType.SPACE_DOCK,
    ].includes(entity.type);
};

export type Building = {
    uid: string;
    type: BuildingType;
    level: number;
    production: number;
    planetUid: string;
};

export enum Rarity {
    COMMON = "COMMON",
    UNCOMMON = "UNCOMMON",
    RARE = "RARE",
    EPIC = "EPIC",
    LEGENDARY = "LEGENDARY"
}

export enum FleetType {
    LIGHT_FIGHTER = "LIGHT_FIGHTER"
}

export const isFleet = (entity: any): entity is Fleet => {
    return entity && entity.type && [
        FleetType.LIGHT_FIGHTER,
    ].includes(entity.type);
};

export type Fleet = {
    uid: string;
    type: FleetType;
    level: number;
    rarity: Rarity;
    planetUid: string;
};

export type Planet = {
    uid: string;
    variant: number;
    name: string;
    resources: Resource[];
    buildings: Building[];
    fleet: Fleet[];
    coordinates: Coordinates;
    lastResourceUpdate: number;
};

export const isExtendedPlanet = (entity: any): entity is ExtendedPlanet => {
    return entity && entity.coordinates !== undefined;
};

export type User = {
    uid: string;
    username: string;
    email: string;
    messages: Message[];
};

export type Message = {
    uid: string;
    type: MessageType;
    content: string;
    read: boolean;
    createdAt: string;
    updatedAt: string;
}

export type RankUser = {
    uid: string;
    username: string;
}

export type Ranking = {
    userUid: string;
    rank: number;
    username: string;
    points: number;
}

export type ComputedRanking = {
    userUid: string;
    difference: number;
    rank: number;
    username: string;
    points: number;
}

export type Coordinates = {
    uid: string;
    x: number;
    y: number;
    z: number;
    xOffset: number;
    yOffset: number;
}

export type Mission = {
    uid: string;
    label: string;
    source: Planet & { userUid: string };
    target: Planet & { userUid: string };
    fleet: Fleet[];
    arrivalTime: string;
    returnTime?: string;
    userUid: string;
    cancelled: boolean;
}

export type Entity = Building | Fleet | Resource | Mission | ExtendedPlanet;

export enum EntityType {
    BUILDING = "BUILDING",
    FLEET = "FLEET",
    RESOURCE = "RESOURCE",
    MISSION = "MISSION"
}

export type EntityReference = {
    uid: string;
    type: EntityType;
}

export enum MessageType {
    MissionResult = "MissionResult",
    MissionReturn = "MissionReturn"
}

export type Event = {
    type: MessageType,
    data: {
        mission: Mission,
        message: Message,
    }
}