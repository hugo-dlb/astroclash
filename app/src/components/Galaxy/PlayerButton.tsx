import { VStack, HStack, Text, Badge } from "@chakra-ui/react";
import { ExtendedPlanet } from "../../api/getGalaxy";
import { useStore } from "../../store/store";
import { Button } from "../Button";
import { Actionable } from "../ActionMenu/Actionable";

type PlayerButtonProps = {
    planet: ExtendedPlanet;
    onMouseEnter: () => void;
    onMouseOut: () => void;
    onClick: (source: HTMLButtonElement) => void;
};

export const PlayerButton = (props: PlayerButtonProps) => {
    const { planet, onMouseEnter, onMouseOut, onClick } = props;
    const user = useStore((state) => state.user);

    return (
        <Actionable>
            <Button
                borderRadius="md"
                backgroundColor={
                    planet.user.uid === user.uid ? "blue.500" : "blue.800"
                }
                borderWidth="2px"
                borderColor={
                    planet.user.uid === user.uid ? "blue.300" : "blue.700"
                }
                height="fit-content"
                _hover={{
                    zIndex: 1,
                    backgroundColor:
                        planet.user.uid === user.uid ? "blue.500" : "blue.800",
                }}
                onMouseEnter={onMouseEnter}
                onMouseOut={onMouseOut}
                px={2}
                onClick={(event) => onClick(event.target as HTMLButtonElement)}
            >
                <VStack spacing={1} p={2} pointerEvents="none">
                    <Text fontSize="sm" whiteSpace="nowrap">
                        {planet.name}
                    </Text>
                    <HStack>
                        <Text fontSize="xs" whiteSpace="nowrap">
                            {planet.user.username}
                        </Text>
                        <Badge>{planet.user.rank.rank}</Badge>
                    </HStack>
                </VStack>
            </Button>
        </Actionable>
    );
};
