import { useLayoutEffect, useRef, useState } from "react";
import { useStore } from "../../store/store";
import { Box, useBreakpointValue } from "@chakra-ui/react";
import { ExtendedPlanet } from "../../api/getGalaxy";
import { CellGrid } from "../../components/Galaxy/CellGrid";
import { GalaxyPlanet } from "../../components/Galaxy/GalaxyPlanet";
import { ANIMATION_TIME, useGalaxy } from "./useGalaxy";
import { GalaxyControls } from "./GalaxyControls";
import { debounce } from "lodash";
import { Coordinates } from "./Coordinates";
import { ActionMenuAction } from "../../store/types";

export const Galaxy = () => {
    const [containerWidth, setContainerWidth] = useState(0);
    const [containerHeight, setContainerHeight] = useState(0);
    const galaxy = useStore((state) => state.galaxy);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const openMenu = useStore((store) => store.openMenu);
    const isLoaded = containerHeight !== 0 && containerWidth !== 0;

    const GRID_SIZE =
        useBreakpointValue(
            {
                base: 320,
                md: 440,
                "2xl": 480,
                "3xl": 800,
            },
            {
                ssr: false,
                fallback: "440px",
            }
        ) || 440;

    const IMAGE_SIZE =
        useBreakpointValue(
            {
                base: 48,
                "2xl": 64,
                "3xl": 96,
            },
            {
                ssr: false,
                fallback: "440px",
            }
        ) || 440;

    const xOverscan = Math.ceil(containerWidth / GRID_SIZE / 2) - 1 + 2;
    const yOverscan = Math.ceil(containerHeight / GRID_SIZE / 2) - 1 + 2;
    const { x, y, move } = useGalaxy({
        isLoaded,
        xOverscan,
        yOverscan,
    });

    const offsetTop = containerHeight / 2 - GRID_SIZE / 2;
    const offsetLeft = containerWidth / 2 - GRID_SIZE / 2;

    const cells: {
        cellX: number;
        cellY: number;
        planets?: ExtendedPlanet[];
    }[] = [];

    for (let j = y - yOverscan; j <= y + yOverscan; j++) {
        for (let i = x - xOverscan; i <= x + xOverscan; i++) {
            cells.push({
                cellX: i,
                cellY: j,
                planets: galaxy.get(`${i}:${j}`),
            });
        }
    }

    const planets = cells
        .map(({ cellX, cellY, planets }) =>
            (planets || []).map((planet) => ({
                planet,
                cellX,
                cellY,
            }))
        )
        .flat();

    useLayoutEffect(() => {
        const container = containerRef.current;

        if (!container) {
            return;
        }

        const updateContainerDimensions = () => {
            setContainerWidth(container.offsetWidth);
            setContainerHeight(container.offsetHeight);
        };

        const handleResize = debounce(updateContainerDimensions, 250);

        window.addEventListener("resize", handleResize);

        updateContainerDimensions();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleGalaxyPlanetClick = (
        planet: ExtendedPlanet,
        source: HTMLButtonElement
    ) => {
        openMenu(ActionMenuAction.GALAXY_PLANET_SELECTION, source, planet);
    };

    return (
        <Box ref={containerRef} position="fixed" inset="0">
            <Coordinates x={x} y={y} />
            <Box
                position="absolute"
                transform={`translate(${offsetLeft}px, ${offsetTop}px)`}
            >
                <Box>
                    {cells.map(({ cellX, cellY }) => (
                        <CellGrid
                            key={`${cellX}:${cellY}`}
                            left={(cellX - x) * GRID_SIZE}
                            top={(cellY - y) * GRID_SIZE}
                            gridSize={GRID_SIZE}
                            animationTime={ANIMATION_TIME}
                        />
                    ))}
                </Box>
                <Box>
                    {planets.map(({ cellX, cellY, planet }) => (
                        <GalaxyPlanet
                            key={planet.uid}
                            planet={planet}
                            x={x}
                            y={y}
                            cellX={cellX}
                            cellY={cellY}
                            gridSize={GRID_SIZE}
                            imageSize={IMAGE_SIZE}
                            animationTime={ANIMATION_TIME}
                            onClick={handleGalaxyPlanetClick}
                        />
                    ))}
                </Box>
            </Box>
            <GalaxyControls
                containerWidth={containerWidth}
                containerHeight={containerHeight}
                move={move}
            />
        </Box>
    );
};
