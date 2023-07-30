export const getSearchParams = (x: number, y: number, highlightedPlanetUid: string | null): {
    x: string;
    y: string;
    planetUid: string;
} | {
    x: string;
    y: string;
} => {
    if (highlightedPlanetUid) {
        return {
            x: x.toString(),
            y: y.toString(),
            planetUid: highlightedPlanetUid
        };
    }

    return {
        x: x.toString(),
        y: y.toString()
    };
};