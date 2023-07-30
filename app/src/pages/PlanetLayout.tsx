import { Container, VStack } from "@chakra-ui/react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { ActionMenu } from "../components/ActionMenu/ActionMenu";
import { MenuBar } from "../components/MenuBar/MenuBar";

export const PlanetLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { planetUid } = useParams();
    const isRootRoute = location.pathname === "/planets";

    const handleBack = () => {
        const isOnPlanet = location.pathname === `/planets/${planetUid}`;

        if (isOnPlanet) {
            navigate("/planets");
        } else if (planetUid) {
            navigate(`/planets/${planetUid}`);
        } else {
            navigate(`/planets`);
        }
    };

    return (
        <VStack
            h="full"
            spacing={4}
            bg="blue.900"
            position="relative"
            overflowY="auto"
        >
            <Container
                pt={{ base: 4, lg: 8 }}
                maxWidth={{ base: "full", lg: "container.lg" }}
            >
                <MenuBar
                    showBackButton={!isRootRoute}
                    handleBack={handleBack}
                />
            </Container>
            <Outlet />
            <ActionMenu />
        </VStack>
    );
};
