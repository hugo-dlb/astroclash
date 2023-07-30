import {
    Container,
    VStack,
    Heading,
    Box,
    HStack,
    Text,
} from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";
import { getPlanetImage } from "../utils/planet";
import { Button } from "../components/Button";

export const Planets = () => {
    const planets = useStore((state) => state.planets);
    const navigate = useNavigate();

    const handlePlanetSelection = (planetUid: string) => {
        navigate(`/planets/${planetUid}`);
    };

    return (
        <Box w="full" h="full" bg="blue.900">
            <Container
                pb={{ base: 4, lg: 8 }}
                maxWidth={{ base: "full", lg: "container.lg" }}
            >
                <VStack alignItems="start" spacing={4}>
                    <Heading color="gray.100">Planets</Heading>
                    <HStack spacing={4}>
                        {planets.map((planet) => (
                            <Button
                                key={planet.uid}
                                h="auto"
                                p={4}
                                onClick={() =>
                                    handlePlanetSelection(planet.uid)
                                }
                            >
                                <VStack spacing="0">
                                    <Image
                                        src={`/assets/${getPlanetImage(
                                            planet.variant
                                        )}`}
                                        w="128px"
                                        h="128px"
                                    />
                                    <Text>{planet.name}</Text>
                                </VStack>
                            </Button>
                        ))}
                    </HStack>
                </VStack>
            </Container>
        </Box>
    );
};
