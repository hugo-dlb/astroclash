import { useState } from "react";
import { Text, HStack, Tooltip, Button } from "@chakra-ui/react";
import { faArrowLeft, faPowerOff } from "@fortawesome/pro-regular-svg-icons";
import { FaIconButton } from "../FaIcon";
import { useStore } from "../../store/store";
import { useNavigate, useParams } from "react-router-dom";
import { Counter } from "../Counter";
import { MissionsPopoverButton } from "./MissionsPopoverButton";
import { MessagesButton } from "./MessagesButton";

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
            p={2}
            border="2px"
            borderColor="blue.700"
            borderRadius="md"
            justifyContent="space-between"
            background="blue.900"
            position="relative"
            zIndex={10}
        >
            <HStack minW="150px" justifyContent="start">
                {showBackButton && (
                    <FaIconButton
                        aria-label="Back"
                        tooltip="Back"
                        icon={faArrowLeft}
                        onClick={handleBack}
                    />
                )}
            </HStack>
            <HStack>
                <Text>{user.username}</Text>
                <Tooltip label="Check leaderboard" placement="right">
                    <Button size="sm" fontSize="md" onClick={handleRanking}>
                        <Counter value={rank.rank} />
                    </Button>
                </Tooltip>
            </HStack>
            <HStack minW="150px" justifyContent="end">
                <MissionsPopoverButton />
                <MessagesButton />
                <FaIconButton
                    aria-label="Logout"
                    tooltip="Logout"
                    icon={faPowerOff}
                    onClick={handleLogout}
                    isLoading={isLogoutLoading}
                />
            </HStack>
        </HStack>
    );
};
