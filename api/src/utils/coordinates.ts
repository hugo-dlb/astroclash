import { prisma } from "../middlewares/prismaMiddleware";

// https://stackoverflow.com/questions/61229890/algorithm-to-find-a-specific-elements-coordinate-in-a-spiral
const getSpiralCoordinates = (spiralProgress: number) => {
    const k = Math.ceil((Math.sqrt(spiralProgress) - 1) / 2);
    let t = (2 * k + 1) ;
    let m = Math.pow(t, 2);
    t = t - 1;

    if (spiralProgress >= m - t) {
        return {
            x: k - (m - spiralProgress),
            y: -k
        };
    } else {
        m = m - t;
    }

    if (spiralProgress >= m - t) {
        return {
            x: -k,
            y: -k + (m - spiralProgress)
        };
    } else {
        m = m - t;
    }

    if (spiralProgress >= m - t) {
        return  {
            x: -k + (m - spiralProgress), 
            y: k
        };
    }

    return {
        x: k,
        y: k - (m - spiralProgress - t)
    };
};

const getNextZIndex = (current: number) => {
    const Z_INDEXES = [0, 1, 2, 3, 4, 5, 6, 7, 8];

    let currentIndex = Z_INDEXES.indexOf(current);
    const distance = Math.floor(Math.random() * (5 - 1 + 1) + 1);

    for (let i = 0; i < distance; i++) {
        if (currentIndex === 8) {
            currentIndex = 1;
        } else {
            currentIndex++;
        }
    }

    return currentIndex;
}; 

export const getPlanetCoordinates = async () => {
    const lastCoordinates = await prisma.coordinates.findFirst({
        orderBy: {
            createdAt: 'desc',
        },
        take: 1,
    });

    const xOffset = Math.floor(Math.random() * (5 - (-5) + 1)) - 5;
    const yOffset = Math.floor(Math.random() * (5 - (-5) + 1)) - 5;

    if (lastCoordinates === null) {
        return {
            spiralProgress: 1,
            ...getSpiralCoordinates(1),
            z: 0,
            xOffset,
            yOffset
        };
    }

    const updatedZCoordinate = getNextZIndex(lastCoordinates.z);
    const {x, y} = updatedZCoordinate < lastCoordinates.z ? getSpiralCoordinates(lastCoordinates.spiralProgress + 1) : lastCoordinates; 

    return {
        spiralProgress: updatedZCoordinate < lastCoordinates.z ? lastCoordinates.spiralProgress + 1 : lastCoordinates.spiralProgress,
        x,
        y,
        z: updatedZCoordinate,
        xOffset,
        yOffset
    };
};