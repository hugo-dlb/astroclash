import { Box, Image, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { useStore } from "../../store/store";
import { BuildingType, FleetType, Planet } from "../../types/types";
import { getSpaceDockSpace } from "../../utils/building";
import { selectPlanetResource } from "../../store/selectors";
import { getFleetTypeCost } from "../../utils/fleet";
import { Button } from "../Button";
import { getActionMenuActionLabel } from "./getActionMenuActionLabel";
import { ActionMenuAction } from "../../store/types";

type BuildFleetMenuProps = {
    planet: Planet;
};

export const BuildFleetMenu = (props: BuildFleetMenuProps) => {
    const { planet } = props;
    const [isLoading, setIsLoading] = useState(false);
    const buildFleet = useStore((state) => state.buildFleet);
    const resource = selectPlanetResource(planet);
    const spaceDockLevel = planet.buildings.find(
        (building) => building.type === BuildingType.SPACE_DOCK
    )!.level;
    const spaceDockSpace = getSpaceDockSpace(spaceDockLevel);
    const canBuildFleet =
        resource.value >= getFleetTypeCost(FleetType.LIGHT_FIGHTER) &&
        planet.fleet.length < spaceDockSpace;

    const handleBuildFleet = async (fleetType: FleetType) => {
        setIsLoading(true);
        try {
            await buildFleet(planet.uid, fleetType);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <VStack>
            <Text fontSize="xl">
                {getActionMenuActionLabel(ActionMenuAction.BUILD_FLEET)}
            </Text>
            <HStack>
                <Button
                    onClick={() => handleBuildFleet(FleetType.LIGHT_FIGHTER)}
                    colorScheme="green"
                    h="auto"
                    py={4}
                    isLoading={isLoading}
                    isDisabled={!canBuildFleet}
                >
                    <HStack spacing={2}>
                        <Box h="auto" w="144px">
                            <Image
                                src={`/assets/light_fighter.png`}
                                h="96px"
                                marginTop="-14px"
                                marginBottom="-14px"
                                marginLeft="-8px"
                            />
                        </Box>
                        <VStack>
                            <HStack>
                                <Image src={`/assets/crystal.png`} h="32px" />
                                <Text fontSize="3xl">
                                    {getFleetTypeCost(FleetType.LIGHT_FIGHTER)}
                                </Text>
                            </HStack>
                            <Text>Build 1 unit</Text>
                        </VStack>
                    </HStack>
                </Button>
            </HStack>
        </VStack>
    );
};
