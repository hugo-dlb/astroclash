import { useState } from "react";
import { useStore } from "../store/store";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Center,
    Container,
    Fade,
    HStack,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { MenuBar } from "../components/MenuBar/MenuBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "../components/Pagination/Pagination";
import { Message, MessageType } from "../types/types";
import { format } from "date-fns";
import { FaIconButton } from "../components/FaIcon";
import { faEnvelopeCircleCheck } from "@fortawesome/pro-duotone-svg-icons";

const ENTRIES_PER_PAGE = 20;

export const Messages = () => {
    const [searchParams] = useSearchParams();
    const planetUid = searchParams.get("planetUid");
    const user = useStore((state) => state.user);
    const { messages } = user;
    const markMessageAsRead = useStore((state) => state.markMessageAsRead);
    const markAllMessagesAsRead = useStore(
        (state) => state.markAllMessagesAsRead
    );
    const [page, setPage] = useState(1);
    const sortedMessages = [...messages].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
    );
    const unreadMessagesCount = messages.filter(
        (message) => !message.read
    ).length;
    const navigate = useNavigate();

    const handleBack = () => {
        if (planetUid) {
            navigate(`/planets/${planetUid}`);
        } else {
            navigate(`/planets`);
        }
    };

    const handlePageChange = (page: number) => {
        setPage(page);
    };

    const getPaginatedEntries = (page: number) => {
        if (page === 1) {
            return sortedMessages.slice(0, ENTRIES_PER_PAGE);
        }

        const start = (page - 1) * ENTRIES_PER_PAGE;
        return sortedMessages.slice(start, start + ENTRIES_PER_PAGE);
    };

    const handleMessageRead = (message: Message) => {
        if (!message.read) {
            markMessageAsRead(message.uid);
        }
    };

    const handleMarkAllAsReadClick = () => {
        markAllMessagesAsRead();
    };

    return (
        <VStack
            h="full"
            spacing={4}
            bg="blue.900"
            position="relative"
            overflowY="auto"
            w="full"
            pb={4}
        >
            <Container
                pt={{ base: 4, lg: 8 }}
                maxWidth={{ base: "full", lg: "container.lg" }}
            >
                <VStack spacing={4}>
                    <MenuBar showBackButton={true} handleBack={handleBack} />
                    <VStack alignItems="start" spacing={6} w="full">
                        <HStack justifyContent="space-between" w="full">
                            <Heading color="gray.100">
                                Messages{" "}
                                {unreadMessagesCount > 0 &&
                                    `(${unreadMessagesCount})`}
                            </Heading>
                            <FaIconButton
                                icon={faEnvelopeCircleCheck}
                                aria-label="Mark all as read"
                                tooltip="Mark all as read"
                                onClick={handleMarkAllAsReadClick}
                                isDisabled={unreadMessagesCount === 0}
                            />
                        </HStack>

                        <Accordion allowMultiple w="full">
                            {getPaginatedEntries(page).map((message) => (
                                <AccordionItem key={message.uid}>
                                    <AccordionButton
                                        onClick={() =>
                                            handleMessageRead(message)
                                        }
                                    >
                                        <HStack
                                            justifyContent="space-between"
                                            w="full"
                                        >
                                            <HStack>
                                                <Text>
                                                    {message.type ===
                                                    MessageType.MissionResult
                                                        ? "Battle Report"
                                                        : "Mission Return"}
                                                </Text>
                                                <Fade in={!message.read}>
                                                    <Box
                                                        borderRadius="50%"
                                                        height="8px"
                                                        width="8px"
                                                        backgroundColor="blue.300"
                                                    />
                                                </Fade>
                                            </HStack>
                                            <HStack>
                                                <Text color="gray.300">
                                                    {format(
                                                        new Date(
                                                            message.createdAt
                                                        ),
                                                        "dd/MM/yy hh:mm:ss a"
                                                    )}
                                                </Text>
                                                <AccordionIcon />
                                            </HStack>
                                        </HStack>
                                    </AccordionButton>
                                    <AccordionPanel pb={4}>
                                        {message.content}
                                    </AccordionPanel>
                                </AccordionItem>
                            ))}
                        </Accordion>
                        <Center w="full">
                            <Pagination
                                page={page}
                                entriesCount={messages.length}
                                entriesPerPage={ENTRIES_PER_PAGE}
                                onChange={handlePageChange}
                            />
                        </Center>
                    </VStack>
                </VStack>
            </Container>
        </VStack>
    );
};
