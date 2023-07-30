import { Planet, Resource } from "@prisma/client";

export const getPlanetResource = (planet: Planet & {
    resources: Resource[]
}) => {
    return planet.resources.find(resource => resource.type === "CRYSTAL")!;
};