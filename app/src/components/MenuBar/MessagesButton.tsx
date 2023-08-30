import { faEnvelope } from "@fortawesome/pro-regular-svg-icons";
import { useStore } from "../../store/store";
import { FaIconButton } from "../FaIcon";
import { useNavigate, useParams } from "react-router-dom";
import { Box } from "@chakra-ui/react";

export const MessagesButton = () => {
    const user = useStore((state) => state.user);
    const { messages } = user;
    const unreadMessagesCount = messages.filter(
        (message) => !message.read
    ).length;
    const { planetUid } = useParams();
    const navigate = useNavigate();

    const handleMessagesClick = () => {
        if (planetUid) {
            navigate(`/messages?planetUid=${planetUid}`);
        } else {
            navigate("/messages");
        }
    };

    return (
        <Box position="relative">
            <FaIconButton
                aria-label="Messages"
                tooltip="Messages"
                icon={faEnvelope}
                onClick={handleMessagesClick}
            />
            {unreadMessagesCount > 0 && (
                <Box
                    display="flex"
                    position="absolute"
                    top="10px"
                    right="8px"
                    borderRadius="50%"
                    backgroundColor="blue.300"
                    height="8px"
                    width="8px"
                    justifyContent="center"
                    alignItems="center"
                />
            )}
        </Box>
    );
};
