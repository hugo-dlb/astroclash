import { Text, HStack, VStack } from "@chakra-ui/react";
import { useStore } from "../../store/store";
import { Mission } from "../../types/types";
import { Button } from "../Button";
import { FaIcon } from "../FaIcon";
import { faInfoCircle } from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";
import { Characteristic, CharacteristicsModal } from "../CharacteristicsModal";
import { faBan } from "@fortawesome/pro-light-svg-icons";
import { format, isBefore } from "date-fns";

type MissionMenuProps = {
    mission: Mission;
};

export const MissionMenu = (props: MissionMenuProps) => {
    const { mission } = props;
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const user = useStore((state) => state.user);
    const [isLoading, setIsLoading] = useState(false);
    const cancelMission = useStore((state) => state.cancelMission);
    const closeMenu = useStore((state) => state.closeMenu);
    const isUnderAttack = mission.target.userUid === user.uid;
    const hasReachedDestination = isBefore(
        new Date(mission.arrivalTime),
        new Date()
    );
    const characteristics = [
        isUnderAttack
            ? false
            : {
                  label: "Name",
                  value: mission.label,
                  type: "DEFAULT",
              },
        {
            label: "Origin",
            value: mission.source,
            type: "PLANET",
        },
        {
            label: "Destination",
            value: mission.target,
            type: "PLANET",
        },
        {
            label: "Arrival Date",
            value: `${format(
                new Date(mission.arrivalTime),
                "dd/MM/yy hh:mm:ss a"
            )}${mission.cancelled ? " · Cancelled" : ""}`,
            type: "DEFAULT",
        },
        isUnderAttack
            ? false
            : {
                  label: "Return Date",
                  value: format(
                      new Date(mission.returnTime!),
                      "dd/MM/yy hh:mm:ss a"
                  ),
                  type: "DEFAULT",
              },
        {
            label: "Fleet",
            value: mission.fleet,
            type: "FLEET",
        },
    ].filter(Boolean) as Characteristic[];

    const handleCancelClick = async () => {
        setIsLoading(true);
        try {
            await cancelMission(mission.uid);
            closeMenu();
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

    return (
        <VStack>
            <Text fontSize="xl">
                {isUnderAttack ? "Incoming Attack" : `Mission ${mission.label}`}
            </Text>
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
                    onClick={handleCancelClick}
                    colorScheme="red"
                    h="100px"
                    py={4}
                    px={6}
                    isLoading={isLoading}
                    isDisabled={mission.cancelled || hasReachedDestination}
                >
                    <VStack>
                        <FaIcon icon={faBan} size="lg" />
                        <Text>Cancel</Text>
                    </VStack>
                </Button>
                <CharacteristicsModal
                    header={
                        isUnderAttack
                            ? "Incoming Attack Details"
                            : "Mission Details"
                    }
                    characteristics={characteristics}
                    isOpen={isDetailsModalOpen}
                    onClose={handleDetailsModalClose}
                />
            </HStack>
        </VStack>
    );
};
