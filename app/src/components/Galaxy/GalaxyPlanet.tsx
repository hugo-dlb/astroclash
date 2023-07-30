import { ExtendedPlanet } from "../../api/getGalaxy";
import { getPlanetPosition } from "../../utils/galaxy";
import { getPlanetImage } from "../../utils/planet";
import { Box, Image } from "@chakra-ui/react";
import { PlayerButton } from "./PlayerButton";
import { useState } from "react";

type GalaxyPlanetProps = {
    planet: ExtendedPlanet;
    x: number;
    y: number;
    cellX: number;
    cellY: number;
    gridSize: number;
    imageSize: number;
    animationTime: number;
    onClick: (planet: ExtendedPlanet, source: HTMLButtonElement) => void;
};

export const GalaxyPlanet = (props: GalaxyPlanetProps) => {
    const {
        planet,
        x,
        y,
        cellX,
        cellY,
        gridSize,
        imageSize,
        animationTime,
        onClick,
    } = props;
    const [isHovered, setIsHovered] = useState(false);

    const { left, top } = getPlanetPosition(
        planet,
        x,
        y,
        cellX,
        cellY,
        gridSize,
        imageSize
    );

    return (
        <Box
            position="absolute"
            transform={`translate(${left}px, ${top}px)`}
            transition={`all ${animationTime}ms`}
            zIndex={isHovered ? 1 : 0}
        >
            <Image
                src={`/assets/${getPlanetImage(planet.variant)}`}
                w={imageSize + "px"}
                h={imageSize + "px"}
                maxW="initial"
            />
            <Box position="absolute" left="50%" transform="translateX(-50%)">
                <PlayerButton
                    planet={planet}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseOut={() => setIsHovered(false)}
                    onClick={(source) => onClick(planet, source)}
                />
            </Box>
        </Box>
    );
};
