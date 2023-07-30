import { Text, Image, HStack, VStack } from "@chakra-ui/react";
import { useStore } from "../../store/store";
import { Fleet, Planet } from "../../types/types";
import { Button } from "../Button";
import { FaIcon } from "../FaIcon";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import {
    getFleetAttackPoints,
    getFleetHealthPoints,
    getFleetLabel,
    getFleetScrapNumber,
    getFleetUpgradeCost,
} from "../../utils/fleet";
import { useState } from "react";
import { selectPlanetResource } from "../../store/selectors";
import { UpgradeFleetModal } from "./UpgradeFleetModal";
import { getEntityLabel } from "../../utils/entity";
import { Characteristic, CharacteristicsModal } from "../CharacteristicsModal";
import { getRarityMultiplier } from "../../utils/rarity";

const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
});

type FleetMenuProps = {
    planet: Planet;
    fleet: Fleet;
};

export const FleetMenu = (props: FleetMenuProps) => {
    const { planet, fleet } = props;
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
    const scrapFleet = useStore((state) => state.scrapFleet);
    const resource = selectPlanetResource(planet);
    const canUpgradeFleet =
        resource.value >= getFleetUpgradeCost(fleet.type, fleet.level + 1);
    const characteristics: Characteristic[] = [
        {
            label: "Level",
            value: fleet.level,
            type: "DEFAULT",
        },
        {
            label: "Rarity",
            value: fleet.rarity,
            type: "RARITY",
        },
        {
            label: "Rarity Multiplier",
            value: getRarityMultiplier(fleet.rarity),
            type: "DEFAULT",
        },
        {
            label: "Health Points",
            value: getFleetHealthPoints(fleet.type, fleet.level, fleet.rarity),
            type: "DEFAULT",
        },
        {
            label: "Attack Points",
            value: getFleetAttackPoints(fleet.type, fleet.level, fleet.rarity),
            type: "DEFAULT",
        },
    ];

    const handleScrapClick = async () => {
        setIsLoading(true);
        try {
            await scrapFleet(planet.uid, fleet.uid);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDetailsClick = () => {
        setIsDetailsModalOpen((previousValue) => !previousValue);
    };

    const handleDetailsModalClose = () => {
        setIsDetailsModalOpen(false);
    };

    const handleUpgradeClick = () => {
        setIsUpgradeModalOpen(true);
    };

    const handleUpgradeModalClose = () => {
        setIsUpgradeModalOpen(false);
    };

    return (
        <VStack>
            <Text fontSize="xl">{getEntityLabel(fleet)}</Text>
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
                    onClick={handleScrapClick}
                    colorScheme="red"
                    h="auto"
                    py={4}
                    isLoading={isLoading}
                >
                    <VStack>
                        <HStack>
                            <Image src={`/assets/crystal.png`} h="32px" />
                            <Text fontSize="3xl">
                                +{formatter.format(getFleetScrapNumber(fleet))}
                            </Text>
                        </HStack>
                        <Text>Scrap</Text>
                    </VStack>
                </Button>
                <Button
                    onClick={handleUpgradeClick}
                    colorScheme="green"
                    h="auto"
                    py={4}
                    isDisabled={isLoading || !canUpgradeFleet}
                >
                    <VStack>
                        <HStack>
                            <Image src={`/assets/crystal.png`} h="32px" />
                            <Text fontSize="3xl">
                                {formatter.format(
                                    getFleetUpgradeCost(
                                        fleet.type,
                                        fleet.level + 1
                                    )
                                )}
                            </Text>
                        </HStack>
                        <Text>Upgrade</Text>
                    </VStack>
                </Button>
                <UpgradeFleetModal
                    planet={planet}
                    fleet={fleet}
                    isOpen={isUpgradeModalOpen}
                    onClose={handleUpgradeModalClose}
                />
                <CharacteristicsModal
                    header={getFleetLabel(fleet.type)}
                    characteristics={characteristics}
                    isOpen={isDetailsModalOpen}
                    onClose={handleDetailsModalClose}
                />
            </HStack>
        </VStack>
    );
};
