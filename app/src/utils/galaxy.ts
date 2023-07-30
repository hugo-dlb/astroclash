import { ExtendedPlanet } from "../api/getGalaxy";

export const getPlanetHighlightPosition = (planet: ExtendedPlanet, gridSize: number) => {
    const CELL_SIZE = gridSize / 3;
    const zIndex = planet.coordinates.z;
    const top = Math.floor((zIndex + 1) / 3);
    const left = zIndex % 3;

    return {
        top: top * CELL_SIZE,
        left: left * CELL_SIZE,
    };
};

export const getPlanetPosition = (planet: ExtendedPlanet, x: number, y: number, cellX: number, cellY: number, gridSize: number, imageWidth: number) => {
    const CELL_SIZE = gridSize / 3;
    const zIndex = planet.coordinates.z;
    const top = Math.floor(zIndex / 3);
    const left = zIndex % 3;

    return {
        top: (cellY - y) * gridSize + top * CELL_SIZE + (CELL_SIZE / 2) - (imageWidth / 2) + planet.coordinates.yOffset * 5,
        left: (cellX - x) * gridSize + left * CELL_SIZE + (CELL_SIZE / 2) - (imageWidth / 2) + planet.coordinates.xOffset * 5,
    };
};