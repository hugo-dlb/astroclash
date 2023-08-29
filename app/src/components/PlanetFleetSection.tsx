import {
    Text,
    VStack,
    HStack,
    Heading,
    Badge,
    Tooltip,
} from "@chakra-ui/react";
import {
    BuildingType,
    EntityType,
    Fleet as FleetType,
    Planet,
} from "../types/types";
import { getSpaceDockSpace } from "../utils/building";
import { BuildFleetButton } from "./BuildFleetButton";
import { Fleet } from "./Fleet";
import { CannotBuildFleetButton } from "./CannotBuildFleetButton";
import { ActionMenuAction, useStore } from "../store/store";
import { useCallback } from "react";
import { faSwords } from "@fortawesome/pro-solid-svg-icons";

type PlanetFleetSectionProps = {
    planet: Planet;
};

export const PlanetFleetSection = (props: PlanetFleetSectionProps) => {
    const { planet } = props;
    const openMenu = useStore((state) => state.openMenu);
    const missions = useStore((state) => state.missions);
    const spaceDockLevel = planet.buildings.find(
        (building) => building.type === BuildingType.SPACE_DOCK
    )!.level;
    const spaceDockSpace = getSpaceDockSpace(spaceDockLevel);
    const canBuildFleet = planet.fleet.length < spaceDockSpace;
    const fleetWithMissions = planet.fleet.map((fleet) => ({
        ...fleet,
        mission: missions.find(
            (mission) =>
                mission.fleet.find(
                    (spaceship) => spaceship.uid === fleet.uid
                ) !== undefined
        ),
    }));

    const handleFleetClick = useCallback(
        (source: HTMLButtonElement, fleet: FleetType) => {
            openMenu(ActionMenuAction.FLEET_SELECTION, source, {
                uid: fleet.uid,
                type: EntityType.FLEET,
            });
        },
        [openMenu]
    );

    return (
        <VStack alignItems="start" spacing={4}>
            <HStack alignItems="baseline" spacing={4}>
                <Heading size="md">Fleet</Heading>
                <Text fontSize="xl" color="gray.500">
                    {planet.fleet.length} / {spaceDockSpace}
                </Text>
                {spaceDockSpace > 0 &&
                    planet.fleet.length === spaceDockSpace && (
                        <Tooltip
                            placement="right"
                            label="Upgrade your Space dock to expand your fleet capacity"
                        >
                            <Badge fontSize="lg" colorScheme="orange">
                                FULL
                            </Badge>
                        </Tooltip>
                    )}
            </HStack>

            <HStack flexWrap="wrap" spacing={4}>
                {spaceDockLevel === 0 && <CannotBuildFleetButton />}
                {fleetWithMissions.map((fleet) => (
                    <Fleet
                        key={fleet.uid}
                        fleet={fleet}
                        onClick={handleFleetClick}
                        hasLowOpacity={fleet.mission !== undefined}
                        lowOpacityIcon={faSwords}
                        isNonActionable={fleet.mission !== undefined}
                    />
                ))}
                {canBuildFleet && <BuildFleetButton />}
            </HStack>
        </VStack>
    );
};
