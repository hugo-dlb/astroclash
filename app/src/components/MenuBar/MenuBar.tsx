import { useState } from "react";
import { Text, HStack, Tooltip, Button } from "@chakra-ui/react";
import { faArrowLeft, faPowerOff } from "@fortawesome/pro-regular-svg-icons";
import { FaIconButton } from "../FaIcon";
import { useStore } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Counter } from "../Counter";
import { MissionsPopoverButton } from "./MissionsPopoverButton";

type MenuBarProps = {
    showBackButton: boolean;
    handleBack: () => void;
};

export const MenuBar = (props: MenuBarProps) => {
    const { showBackButton, handleBack } = props;
    const [isLogoutLoading, setIsLogoutLoading] = useState(false);
    const { planetUid } = useParams();
    const navigate = useNavigate();
    const logout = useStore((state) => state.logout);
    const user = useStore((state) => state.user);
    const rank = useStore((state) =>
        state.ranks.find((rank) => rank.userUid === user.uid)
    )!;

    const handleLogout = async () => {
        setIsLogoutLoading(true);

        try {
            await logout();
        } finally {
            navigate("/login");
        }

        setIsLogoutLoading(false);
    };

    const handleRanking = () => {
        if (planetUid) {
            navigate(`/ranking?planetUid=${planetUid}`);
        } else {
            navigate("/ranking");
        }
    };

    return (
        <HStack
            w="full"
            border="2px"
            borderColor="blue.700"
            borderRadius="md"
            p={4}
            justifyContent="center"
            position="relative"
        >
            {showBackButton && (
                <FaIconButton
                    aria-label="Back"
                    tooltip="Back"
                    icon={faArrowLeft}
                    onClick={handleBack}
                    position="absolute"
                    left="12px"
                    top="12px"
                />
            )}
            <Text>{user.username}</Text>
            <Tooltip label="Check leaderboard" placement="right">
                <Button size="sm" fontSize="md" onClick={handleRanking}>
                    <Counter value={rank.rank} />
                </Button>
            </Tooltip>
            <MissionsPopoverButton />
            <FaIconButton
                aria-label="Logout"
                tooltip="Logout"
                icon={faPowerOff}
                onClick={handleLogout}
                isLoading={isLogoutLoading}
                position="absolute"
                right="12px"
                top="12px"
            />
        </HStack>
    );
};
