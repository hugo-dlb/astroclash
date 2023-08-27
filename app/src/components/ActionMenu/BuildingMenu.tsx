import { Text, Image, HStack, VStack } from "@chakra-ui/react";
import { selectPlanetResource } from "../../store/selectors";
import { useStore } from "../../store/store";
import { Building, BuildingType, Planet } from "../../types/types";
import { Button } from "../Button";
import { FaIcon } from "../FaIcon";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import {
    getBuildingCost,
    getBuildingLabel,
    getCrystalMineProduction,
    getSpaceDockSpace,
} from "../../utils/building";
import { getEntityLabel } from "../../utils/entity";
import { Characteristic, CharacteristicsModal } from "../CharacteristicsModal";
import { useState } from "react";

const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
});

type BuildingMenuProps = {
    planet: Planet;
    building: Building;
};

export const BuildingMenu = (props: BuildingMenuProps) => {
    const { planet, building } = props;
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const upgrade = useStore((state) => state.upgradeBuilding);
    const resource = selectPlanetResource(planet);
    const nextLevelCost = getBuildingCost(building.type, building.level + 1);
    const isUpgradeDisabled = resource.value < nextLevelCost;
    const characteristics: Characteristic[] = [
        {
            label: "Level",
            value: building.level,
            type: "DEFAULT",
        },
        {
            label:
                building.type === BuildingType.CRYSTAL_MINE
                    ? "Production"
                    : "Capacity",
            value:
                building.type === BuildingType.CRYSTAL_MINE
                    ? formatter.format(
                          getCrystalMineProduction(building.level)
                      ) + " crystal per hour"
                    : getSpaceDockSpace(building.level) + " spaceships",
            type: "DEFAULT",
        },
    ];

    const handleUpgradeClick = () => {
        upgrade(building);
    };

    const handleDetailsClick = () => {
        setIsDetailsModalOpen((previousValue) => !previousValue);
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalOpen(false);
    };

    return (
        <VStack>
            <Text fontSize="xl">{getEntityLabel(building)}</Text>
            <HStack spacing={4}>
                <Button
                    onClick={handleDetailsClick}
                    colorScheme="blue"
                    h="100px"
                    py={4}
                    px={6}
                >
                    <VStack>
                        <FaIcon icon={faInfoCircle} size="lg" />
                        <Text>Details</Text>
                    </VStack>
                </Button>
                <Button
                    onClick={handleUpgradeClick}
                    colorScheme="green"
                    h="auto"
                    py={4}
                    isDisabled={isUpgradeDisabled}
                >
                    <VStack>
                        <HStack>
                            <Image src={`/assets/crystal.png`} h="32px" />
                            <Text fontSize="3xl">
                                {formatter.format(nextLevelCost)}
                            </Text>
                        </HStack>
                        <Text>Upgrade to level {building.level + 1}</Text>
                    </VStack>
                </Button>
            </HStack>
            <CharacteristicsModal
                header={getBuildingLabel(building.type)}
                characteristics={characteristics}
                isOpen={isDetailsModalOpen}
                onClose={handleDetailsModalClose}
            />
        </VStack>
    );
};
