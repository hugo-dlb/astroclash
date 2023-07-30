import { useLayoutEffect, useRef, useState } from "react";
import { ActionMenuAction, useStore } from "../../store/store";
import { Box, VStack, useBreakpointValue } from "@chakra-ui/react";
import { ExtendedPlanet } from "../../api/getGalaxy";
import { CellGrid } from "../../components/Galaxy/CellGrid";
import { GalaxyPlanet } from "../../components/Galaxy/GalaxyPlanet";
import { ANIMATION_TIME, useGalaxy } from "./useGalaxy";
import { GalaxyControls } from "./GalaxyControls";

const BORDER_WIDTH = 2;
const PADDING_WIDTH = 32;

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

    const offsetTop = containerHeight / 2 - GRID_SIZE / 2 - BORDER_WIDTH;
    const offsetLeft =
        containerWidth / 2 - GRID_SIZE / 2 - BORDER_WIDTH - PADDING_WIDTH;

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

        window.addEventListener("resize", updateContainerDimensions);

        updateContainerDimensions();

        return () => {
            window.removeEventListener("resize", updateContainerDimensions);
        };
    }, []);

    const handleGalaxyPlanetClick = (
        planet: ExtendedPlanet,
        source: HTMLButtonElement
    ) => {
        openMenu(ActionMenuAction.GALAXY_PLANET_SELECTION, source, planet);
    };

    return (
        <>
            <VStack
                h="full"
                spacing={4}
                bg="blue.900"
                position="relative"
                overflowY="auto"
                w="full"
                pb={4}
            >
                <Box
                    ref={containerRef}
                    w={{ base: "calc(100% - 32px)", lg: "calc(100% - 64px)" }}
                    h={{
                        base: "calc(100vh - 172px)",
                        lg: "calc(100vh - 207px)",
                    }}
                    position="relative"
                    overflow="hidden"
                    border="2px"
                    borderColor="blue.700"
                    borderRadius="md"
                    boxSizing="border-box"
                    px={{ base: 4, lg: 8 }}
                >
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
            </VStack>
        </>
    );
};
