import { useState, useEffect, useRef } from "react";
import { ActionMenuAction, useStore } from "../../store/store";
import { FaIcon, FaIconButton } from "../FaIcon";
import {
    Badge,
    Box,
    HStack,
    Image,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Text,
} from "@chakra-ui/react";
import { faStarfighter } from "@fortawesome/pro-solid-svg-icons";
import { getPlanetImage } from "../../utils/planet";
import { EntityType, Mission } from "../../types/types";
import { faWarning } from "@fortawesome/pro-solid-svg-icons";
import { Actionable } from "../ActionMenu/Actionable";
import { getMissionFormattedDuration } from "./getMissionFormattedDuration";
import { differenceInSeconds } from "date-fns";

export const MissionsPopoverButton = () => {
    const openMenu = useStore((state) => state.openMenu);
    const getMissions = useStore((state) => state.getMissions);
    const missions = useStore((state) => state.missions);
    const planets = useStore((state) => state.planets);
    const userPlanetUids = planets.map((planet) => planet.uid);
    const [now, setNow] = useState(new Date());
    const lastMissionUpdateTimestamp = useRef<Date>();
    const missionDurations = missions.map(mission => getMissionFormattedDuration(mission, userPlanetUids.includes(
        mission.target.uid
    ), now));
    const shouldUpdateMissions = missionDurations.some(duration => duration === "Done");

    if (shouldUpdateMissions) {
        if (!lastMissionUpdateTimestamp.current || (differenceInSeconds(new Date(), lastMissionUpdateTimestamp.current) > 5)) {
            getMissions();
            lastMissionUpdateTimestamp.current = new Date();
        }
    }

    useEffect(() => {
        const updateNow = () => setNow(new Date());

        const id = setInterval(updateNow, 1000);

        return () => clearInterval(id);
    }, []);

    if (missions.length === 0) {
        return null;
    }

    const sortedMissions = [...missions].sort(
        (a, b) =>
            new Date(a.arrivalTime).getTime() -
            new Date(b.arrivalTime).getTime()
    );

    const handleMissionClick = (source: HTMLDivElement, mission: Mission) => {
        openMenu(ActionMenuAction.MISSION_SELECTION, source, {
            uid: mission.uid,
            type: EntityType.MISSION,
        });
    };

    const isUnderAttack =
        missions.find((mission) =>
            userPlanetUids.includes(mission.target.uid)
        ) !== undefined;

    const dangerColor = "red.400";

    return (
        <Popover placement="bottom-end" returnFocusOnClose={false}>
            <PopoverTrigger>
                <FaIconButton
                    aria-label="Missions"
                    tooltip={`Missions (${missions.length})`}
                    icon={faStarfighter}
                    iconColor={isUnderAttack ? "red.900" : undefined}
                    position="absolute"
                    right="64px"
                    top="12px"
                    colorScheme={isUnderAttack ? "red" : undefined}
                />
            </PopoverTrigger>
            <PopoverContent w="360px" overflow="hidden">
                <Box>
                    {sortedMissions.map((mission, index) => {
                        const isIncoming = userPlanetUids.includes(
                            mission.target.uid
                        );
                        const duration = missionDurations[index];

                        return (
                            <Actionable key={mission.uid}>
                                <HStack
                                    py={2}
                                    px={6}
                                    mx="-12px"
                                    justifyContent="space-between"
                                    cursor="pointer"
                                    transition="all 250ms"
                                    _hover={{
                                        backgroundColor: "rgb(58 86 123)",
                                        transform: "scale(1.05)",
                                    }}
                                    _active={{
                                        backgroundColor: "rgb(52 77 111)",
                                        transform: "scale(0.95)",
                                    }}
                                    onClick={(event) =>
                                        handleMissionClick(
                                            event.target as HTMLDivElement,
                                            mission
                                        )
                                    }
                                >
                                    <HStack spacing={4}>
                                        {isIncoming ? (
                                            <Box h="32px">
                                                <FaIcon
                                                    alignSelf="center"
                                                    icon={faWarning}
                                                    color={dangerColor}
                                                    fontSize="lg"
                                                    mt="6px"
                                                    ml="7px"
                                                />
                                            </Box>
                                        ) : (
                                            <Image
                                                src={`/assets/${getPlanetImage(
                                                    mission.source.variant
                                                )}`}
                                                w="32px"
                                                h="32px"
                                                mr="-6px"
                                            />
                                        )}
                                        <Text
                                            fontSize="sm"
                                            color={
                                                isIncoming
                                                    ? dangerColor
                                                    : undefined
                                            }
                                        >
                                            {isIncoming
                                                ? mission.target.name
                                                : mission.label}
                                        </Text>
                                        <Badge
                                            fontSize="sm"
                                            colorScheme={
                                                isIncoming ? "red" : undefined
                                            }
                                            variant="solid"
                                        >
                                            <HStack>
                                                <FaIcon
                                                    icon={faStarfighter}
                                                    color={
                                                        isIncoming
                                                            ? "red.100"
                                                            : undefined
                                                    }
                                                    fontSize="sm"
                                                />
                                                <Text
                                                    fontSize="sm"
                                                    color={
                                                        isIncoming
                                                            ? "red.100"
                                                            : undefined
                                                    }
                                                >
                                                    {mission.fleet.length}
                                                </Text>
                                            </HStack>
                                        </Badge>
                                    </HStack>
                                    <Text
                                        fontSize="sm"
                                        color={
                                            isIncoming ? dangerColor : undefined
                                        }
                                    >
                                        {duration}
                                    </Text>
                                </HStack>
                            </Actionable>
                        );
                    })}
                </Box>
            </PopoverContent>
        </Popover>
    );
};
