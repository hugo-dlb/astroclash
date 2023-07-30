import { VStack, Text, Badge, HStack } from "@chakra-ui/react";
import { ExtendedPlanet } from "../../api/getGalaxy";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/store";
import { FaIcon } from "../FaIcon";
import { faCrosshairs } from "@fortawesome/pro-duotone-svg-icons";
import { faRankingStar } from "@fortawesome/pro-duotone-svg-icons";
import { Button } from "../Button";

type GalaxyPlanetMenuProps = {
    planet: ExtendedPlanet;
};

export const GalaxyPlanetMenu = (props: GalaxyPlanetMenuProps) => {
    const { planet } = props;
    const closeMenu = useStore((state) => state.closeMenu);
    const navigate = useNavigate();

    const handleCheckRanking = () => {
        closeMenu();
        navigate(`/ranking?userUid=${planet.user.uid}`);
    };

    const handleAttack = () => {
        closeMenu();
        navigate("../attack", {
            state: {
                planet,
            },
            relative: "path",
        });
    };

    return (
        <VStack>
            <Text fontSize="xl">{planet.name}</Text>
            <HStack spacing={4}>
                <Button onClick={handleCheckRanking} h="96px" py={4}>
                    <VStack spacing={4}>
                        <FaIcon icon={faRankingStar} size="2xl" />
                        <HStack>
                            <Text>Ranking</Text>
                            <Badge fontSize="lg">{planet.user.rank.rank}</Badge>
                        </HStack>
                    </VStack>
                </Button>
                <Button
                    onClick={handleAttack}
                    h="96px"
                    colorScheme="red"
                    px={6}
                >
                    <VStack spacing={2}>
                        <FaIcon icon={faCrosshairs} size="2xl" />
                        <Text>Attack</Text>
                    </VStack>
                </Button>
            </HStack>
        </VStack>
    );
};
