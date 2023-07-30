import { ReactElement } from "react";
import { useEffect } from "react";
import { Center, Container, Spinner, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store/store";

type ProtectedRouteProps = {
    children: ReactElement;
};

export const ProtectedRoute = (props: ProtectedRouteProps) => {
    const { children } = props;
    const getProfile = useStore((state) => state.getProfile);
    const user = useStore((state) => state.user);
    const isLoading = !user.uid;
    const navigate = useNavigate();

    useEffect(() => {
        if (user.uid) {
            return;
        }

        getProfile().catch(() => navigate("/login"));
    }, []);

    if (isLoading) {
        return (
            <VStack h="full" spacing={4} bg="blue.900">
                <Container
                    pt={{ base: 4, lg: 8 }}
                    maxWidth={{ base: "full", lg: "container.lg" }}
                >
                    <Center h="400px">
                        <Spinner size="xl" />
                    </Center>
                </Container>
            </VStack>
        );
    }

    return children;
};
