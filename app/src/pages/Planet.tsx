import { Container, VStack, Heading, Box, HStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { Image } from "@chakra-ui/react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Building } from "../components/Building";
import { useStore } from "../store/store";
import { makeSelectPlanet } from "../store/selectors";
import { Resource } from "../components/Resource";
import { PlanetName } from "../components/PlanetName";
import { getPlanetImage } from "../utils/planet";
import { PlanetFleetSection } from "../components/PlanetFleetSection";
import { faSolarSystem } from "@fortawesome/pro-duotone-svg-icons";
import { Button } from "../components/Button";
import { FaIcon } from "../components/FaIcon";

export const Planet = () => {
    const { planetUid } = useParams();
    const navigate = useNavigate();
    const planet = useStore(makeSelectPlanet(planetUid!));
    const updatePlanetResources = useStore(
        (state) => state.updatePlanetResources
    );

    useEffect(() => {
        const interval = setInterval(() => {
            updatePlanetResources(planetUid!);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!planetUid) {
        return <Navigate to="/" />;
    }

    const handleGalaxyClick = () => {
        navigate(`galaxy?x=${planet.coordinates.x}&y=${planet.coordinates.y}`);
    };

    return (
        <Box w="full" h="full" bg="blue.900">
            <Container
                pb={{ base: 4, lg: 32 }}
                maxWidth={{ base: "full", lg: "container.lg" }}
            >
                <VStack alignItems="start" spacing={4}>
                    <HStack spacing={4} justifyContent="space-between" w="full">
                        <HStack>
                            <Image
                                src={`/assets/${getPlanetImage(
                                    planet.variant
                                )}`}
                                w="64px"
                                h="64px"
                                ml="-8px"
                            />
                            <PlanetName planet={planet} />
                        </HStack>
                        <Button
                            onClick={handleGalaxyClick}
                            leftIcon={
                                <FaIcon fontSize="2xl" icon={faSolarSystem} />
                            }
                        >
                            Galaxy
                        </Button>
                    </HStack>
                    <VStack alignItems="start" spacing={8}>
                        <VStack alignItems="start" spacing={4}>
                            <Heading size="md">Resources</Heading>
                            <HStack>
                                {planet.resources.map((resource) => (
                                    <Resource
                                        key={resource.type}
                                        resource={resource}
                                    />
                                ))}
                            </HStack>
                        </VStack>
                        <VStack alignItems="start" spacing={4}>
                            <Heading size="md">Buildings</Heading>
                            <HStack spacing={4}>
                                {planet.buildings.map((building) => (
                                    <Building
                                        key={building.type}
                                        building={building}
                                    />
                                ))}
                            </HStack>
                        </VStack>
                        <PlanetFleetSection planet={planet} />
                    </VStack>
                </VStack>
            </Container>
        </Box>
    );
};
