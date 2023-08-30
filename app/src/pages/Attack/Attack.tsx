import { useEffect } from "react";
import {
    Navigate,
    useLocation,
    useNavigate,
    useParams,
} from "react-router-dom";
import { ExtendedPlanet } from "../../api/getGalaxy";
import { isAttackProps } from "./isAttackProps";
import { useStore } from "../../store/store";
import {
    makeSelectPlanet,
    selectFleetWithoutMissions,
} from "../../store/selectors";
import { getMissionDuration } from "../../utils/mission";
import { useState } from "react";
import { Fleet as FleetType } from "../../types/types";
import { Fleet } from "../../components/Fleet";
import {
    Badge,
    Checkbox,
    Container,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    Heading,
    Text,
    Tooltip,
    VStack,
} from "@chakra-ui/react";
import { formatDuration } from "../../utils/date";
import { addSeconds, format } from "date-fns";
import { Button } from "../../components/Button";
import { FaIcon } from "../../components/FaIcon";
import { Card } from "../../components/Card";
import { faCrosshairs } from "@fortawesome/pro-duotone-svg-icons";
import { faCircleCheck } from "@fortawesome/pro-regular-svg-icons";

export type AttackProps = {
    planet: ExtendedPlanet;
};

export const Attack = () => {
    const { state } = useLocation();
    const { planetUid } = useParams();
    const sourcePlanet = useStore(makeSelectPlanet(planetUid!));
    const missions = useStore((state) => state.missions);
    const [isLoading, setIsLoading] = useState(false);
    const [now, setNow] = useState(new Date());
    const [missionLabel, setMissionLabel] = useState(
        isAttackProps(state) ? state.planet.name : ""
    );
    const [selectedFleet, setSelectedFleet] = useState<FleetType[]>([]);
    const selectedFleetUids = selectedFleet.map((fleet) => fleet.uid);
    const createMission = useStore((state) => state.createMission);
    const fleetWithoutMissions = selectFleetWithoutMissions(
        sourcePlanet.fleet,
        missions
    );
    const navigate = useNavigate();

    useEffect(() => {
        const updateNow = () => setNow(new Date());

        const id = setInterval(updateNow, 1000);

        return () => clearInterval(id);
    }, []);

    if (!isAttackProps(state) || !planetUid) {
        return <Navigate to="/planets" />;
    }

    const handleFleetSelection = (fleet: FleetType) => {
        const existingIndex = selectedFleet.findIndex(
            (selectedFleet) => selectedFleet.uid === fleet.uid
        );

        if (existingIndex === -1) {
            setSelectedFleet((previousValue) => [...previousValue, fleet]);
        } else {
            setSelectedFleet((previousValue) =>
                previousValue.filter(
                    (selectedFleet) => selectedFleet.uid !== fleet.uid
                )
            );
        }
    };

    const handleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            setSelectedFleet(sourcePlanet.fleet);
        } else {
            setSelectedFleet([]);
        }
    };

    const handleAttackClick = async () => {
        setIsLoading(true);
        try {
            await createMission(
                missionLabel,
                selectedFleetUids,
                sourcePlanet.uid,
                targetPlanet.uid
            );
            navigate("..");
        } finally {
            setIsLoading(false);
        }
    };

    const { planet: targetPlanet } = state;
    const duration = getMissionDuration(
        sourcePlanet.coordinates,
        targetPlanet.coordinates,
        selectedFleet
    );

    const arrivalDate = format(
        addSeconds(now, duration),
        "dd/MM/yy hh:mm:ss a"
    );

    const returnDate = format(
        addSeconds(now, duration * 2),
        "dd/MM/yy hh:mm:ss a"
    );

    return (
        <Container maxWidth={{ base: "full", lg: "container.lg" }}>
            <VStack alignItems="start" spacing={4}>
                <Heading color="gray.100">Attack · {targetPlanet.name}</Heading>
                <Card>
                    <VStack alignItems="start" spacing={4}>
                        <HStack w="full" justifyContent="space-between">
                            <HStack>
                                <Heading size="md" color="gray.100">
                                    Fleet selection
                                </Heading>
                                {selectedFleet.length > 0 && (
                                    <Badge fontSize="md" px={2}>
                                        {selectedFleet.length}
                                    </Badge>
                                )}
                            </HStack>
                            <Checkbox
                                size="lg"
                                isChecked={
                                    selectedFleet.length ===
                                    sourcePlanet.fleet.length
                                }
                                onChange={(event) =>
                                    handleSelectAll(event.target.checked)
                                }
                            >
                                Select all
                            </Checkbox>
                        </HStack>
                        <HStack spacing={4} wrap="wrap">
                            {fleetWithoutMissions.map((fleet) => (
                                <Fleet
                                    key={fleet.uid}
                                    fleet={fleet}
                                    hasLowOpacity={selectedFleetUids.includes(
                                        fleet.uid
                                    )}
                                    lowOpacityIcon={faCircleCheck}
                                    onClick={() => handleFleetSelection(fleet)}
                                />
                            ))}
                        </HStack>
                    </VStack>
                </Card>

                <Card>
                    <VStack alignItems="start" spacing={4}>
                        <Heading size="md" color="gray.100">
                            Mission
                        </Heading>
                        <VStack alignItems="start">
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Name:
                                </Text>
                                <Editable
                                    value={missionLabel}
                                    onChange={setMissionLabel}
                                >
                                    <EditablePreview fontSize="md" />
                                    <EditableInput fontSize="md" />
                                </Editable>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Player:
                                </Text>
                                <Text fontSize="md">
                                    {targetPlanet.user.username}
                                </Text>
                                <Badge fontSize="md">
                                    {targetPlanet.user.rank.rank}
                                </Badge>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Origin:
                                </Text>
                                <Text fontSize="md">{sourcePlanet.name}</Text>
                                <Badge fontSize="md">
                                    {sourcePlanet.coordinates.x}:
                                    {sourcePlanet.coordinates.y}:
                                    {sourcePlanet.coordinates.z}
                                </Badge>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Destination:
                                </Text>
                                <Text fontSize="md">{targetPlanet.name}</Text>
                                <Badge fontSize="md">
                                    {targetPlanet.coordinates.x}:
                                    {targetPlanet.coordinates.y}:
                                    {targetPlanet.coordinates.z}
                                </Badge>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Flight duration:
                                </Text>
                                <Text fontSize="md">
                                    {selectedFleet.length > 0
                                        ? formatDuration(duration)
                                        : "-"}
                                </Text>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Arrival:
                                </Text>
                                <Text fontSize="md">
                                    {selectedFleet.length > 0
                                        ? arrivalDate
                                        : "-"}
                                </Text>
                            </HStack>
                            <HStack>
                                <Text fontSize="md" color="gray.300">
                                    Return:
                                </Text>
                                <Text fontSize="md">
                                    {selectedFleet.length > 0
                                        ? returnDate
                                        : "-"}
                                </Text>
                            </HStack>
                        </VStack>
                    </VStack>
                </Card>

                <HStack justifyContent="end" w="full">
                    <Tooltip
                        label={
                            selectedFleet.length === 0
                                ? "Select at least one spaceship"
                                : undefined
                        }
                    >
                        <Button
                            h="96px"
                            colorScheme="red"
                            px={4}
                            isLoading={isLoading}
                            isDisabled={selectedFleet.length === 0}
                            onClick={handleAttackClick}
                        >
                            <HStack spacing={4}>
                                <FaIcon icon={faCrosshairs} size="2xl" />
                                <Text>Launch Mission</Text>
                            </HStack>
                        </Button>
                    </Tooltip>
                </HStack>
            </VStack>
        </Container>
    );
};
