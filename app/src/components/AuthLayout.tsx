import {
    Box,
    Container,
    HStack,
    VStack,
    Heading,
    Text,
    useBreakpointValue,
} from "@chakra-ui/react";
import { ReactElement } from "react";

type AuthLayoutProps = {
    children: ReactElement;
};

export const AuthLayout = (props: AuthLayoutProps) => {
    const { children } = props;
    const isMobile = useBreakpointValue(
        {
            base: true,
            sm: true,
            md: true,
            lg: false,
            xl: false,
        },
        {
            ssr: false,
        }
    );

    return (
        <Box position="relative" bg="blue.900">
            {!isMobile && (
                <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="50%"
                    bottom="0"
                    backgroundColor="blue.700"
                    backgroundImage={`/assets/background.jpg`}
                    backgroundSize="cover"
                    backgroundBlendMode="hard-light"
                    borderRightWidth="2px"
                    borderColor="blue.700"
                />
            )}
            <Container maxWidth="8xl" position="relative" px={8}>
                <HStack
                    h="100vh"
                    spacing={[0, 0, 0, 16, 48]}
                    alignItems={["start", "start", "center"]}
                >
                    {!isMobile && (
                        <VStack w="full" pb={24}>
                            <VStack spacing={8}>
                                <Heading size="2xl">
                                    The real-time massively multiplayer space
                                    strategy game
                                </Heading>
                                <Text fontSize="xl">
                                    Join Astroclash now and fight against
                                    thousands of players worldwide.
                                </Text>
                            </VStack>
                        </VStack>
                    )}
                    <VStack w="full" pb={24} mt={[8, 8, 0, 0]}>
                        {children}
                    </VStack>
                </HStack>
            </Container>
        </Box>
    );
};
