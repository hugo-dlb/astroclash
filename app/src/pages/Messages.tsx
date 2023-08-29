import { useState } from "react";
import { useStore } from "../store/store";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Center,
    Container,
    HStack,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import { MenuBar } from "../components/MenuBar/MenuBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Pagination } from "../components/Pagination/Pagination";
import { MessageType } from "../types/types";
import { format } from "date-fns";

const ENTRIES_PER_PAGE = 20;

export const Messages = () => {
    const [searchParams] = useSearchParams();
    const planetUid = searchParams.get("planetUid");
    const user = useStore((state) => state.user);
    const [page, setPage] = useState(1);
    const { messages } = user;
    const sortedMessages = [...messages].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt)
    );
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
                        <Heading color="gray.100">Messages</Heading>
                        <Accordion allowMultiple w="full">
                            {getPaginatedEntries(page).map((message) => (
                                <AccordionItem key={message.uid}>
                                    <AccordionButton>
                                        <HStack
                                            justifyContent="space-between"
                                            w="full"
                                        >
                                            <Text>
                                                {message.type ===
                                                MessageType.MissionResult
                                                    ? "Battle Report"
                                                    : "Mission Return"}
                                            </Text>
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
