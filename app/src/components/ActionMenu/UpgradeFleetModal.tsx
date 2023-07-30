import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    HStack,
    Button,
    Table,
    TableContainer,
    Tbody,
    Td,
    Th,
    Thead,
    Tr,
    Badge,
} from "@chakra-ui/react";
import { Fleet, Planet } from "../../types/types";
import { getEntityLabel } from "../../utils/entity";
import {
    getRarityBackgroundHoverColor,
    getRarityLabel,
    getRarityMultiplier,
} from "../../utils/rarity";
import { Actionable } from "./Actionable";
import { useStore } from "../../store/store";
import { useState } from "react";
import { FaIcon } from "../FaIcon";
import { faArrowRightLong } from "@fortawesome/pro-regular-svg-icons";
import { getFleetAttackPoints, getFleetHealthPoints } from "../../utils/fleet";
import { RarityBadge } from "../RarityBadge/RarityBadge";

type UpgradeFleetModalProps = {
    planet: Planet;
    fleet: Fleet;
    isOpen: boolean;
    onClose: () => void;
};

export const UpgradeFleetModal = (props: UpgradeFleetModalProps) => {
    const { planet, fleet, isOpen, onClose } = props;
    const [previousRarity, setPreviousRarity] = useState(fleet.rarity);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpgradeComplete, setIsUpgradeComplete] = useState(false);
    const upgradeFleet = useStore((state) => state.upgradeFleet);

    const handleUpgradeClick = async () => {
        setIsLoading(true);
        setPreviousRarity(fleet.rarity);
        try {
            await upgradeFleet(planet.uid, fleet.uid);
            setIsUpgradeComplete(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setIsUpgradeComplete(false);
        onClose();
    };

    const header = isUpgradeComplete
        ? "Upgrade Results"
        : `Upgrade ${getEntityLabel(fleet)}`;

    return (
        <Modal isOpen={isOpen} onClose={handleClose} size="2xl" isCentered>
            <ModalOverlay />
            <Actionable>
                <ModalContent>
                    <ModalHeader>{header}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {isUpgradeComplete ? (
                            <TableContainer>
                                <Table>
                                    <Thead>
                                        <Tr>
                                            <Th>Characteristic</Th>
                                            <Th isNumeric></Th>
                                            <Th></Th>
                                            <Th isNumeric></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <Td>Level</Td>
                                            <Td isNumeric>{fleet.level - 1}</Td>
                                            <Td color="blue.400">
                                                <FaIcon
                                                    icon={faArrowRightLong}
                                                />
                                            </Td>
                                            <Td isNumeric>{fleet.level}</Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Rarity</Td>
                                            <Td isNumeric>
                                                <RarityBadge
                                                    rarity={previousRarity}
                                                />
                                            </Td>
                                            <Td color="blue.400">
                                                <FaIcon
                                                    icon={faArrowRightLong}
                                                />
                                            </Td>
                                            <Td isNumeric>
                                                <RarityBadge
                                                    rarity={fleet.rarity}
                                                />
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Rarity Multiplier</Td>
                                            <Td isNumeric>
                                                {getRarityMultiplier(
                                                    previousRarity
                                                )}
                                            </Td>
                                            <Td color="blue.400">
                                                <FaIcon
                                                    icon={faArrowRightLong}
                                                />
                                            </Td>
                                            <Td isNumeric>
                                                {getRarityMultiplier(
                                                    fleet.rarity
                                                )}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Health Points</Td>
                                            <Td isNumeric>
                                                {getFleetHealthPoints(
                                                    fleet.type,
                                                    fleet.level - 1,
                                                    previousRarity
                                                )}
                                            </Td>
                                            <Td color="blue.400">
                                                <FaIcon
                                                    icon={faArrowRightLong}
                                                />
                                            </Td>
                                            <Td isNumeric>
                                                {getFleetHealthPoints(
                                                    fleet.type,
                                                    fleet.level,
                                                    fleet.rarity
                                                )}
                                            </Td>
                                        </Tr>
                                        <Tr>
                                            <Td>Attack Points</Td>
                                            <Td isNumeric>
                                                {getFleetAttackPoints(
                                                    fleet.type,
                                                    fleet.level - 1,
                                                    previousRarity
                                                )}
                                            </Td>
                                            <Td color="blue.400">
                                                <FaIcon
                                                    icon={faArrowRightLong}
                                                />
                                            </Td>
                                            <Td isNumeric>
                                                {getFleetAttackPoints(
                                                    fleet.type,
                                                    fleet.level,
                                                    fleet.rarity
                                                )}
                                            </Td>
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                        ) : (
                            `Upgrading this spaceship to level ${
                                fleet.level + 1
                            } will reroll its rarity.`
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <HStack>
                            <Button variant="ghost" onClick={handleClose}>
                                {isUpgradeComplete ? "Close" : "Cancel"}
                            </Button>
                            {!isUpgradeComplete && (
                                <Button
                                    colorScheme="green"
                                    onClick={handleUpgradeClick}
                                    isLoading={isLoading}
                                >
                                    Upgrade
                                </Button>
                            )}
                        </HStack>
                    </ModalFooter>
                </ModalContent>
            </Actionable>
        </Modal>
    );
};
