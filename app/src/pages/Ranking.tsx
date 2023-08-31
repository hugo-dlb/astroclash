import { useEffect, useRef, useState } from "react";
import { useStore } from "../store/store";
import {
    Badge,
    Center,
    Container,
    HStack,
    Heading,
    Skeleton,
    Table,
    TableContainer,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    VStack,
} from "@chakra-ui/react";
import { MenuBar } from "../components/MenuBar/MenuBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RankDifference } from "../components/RankDifference";
import { Pagination } from "../components/Pagination/Pagination";

const ENTRIES_PER_PAGE = 100;

const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
});

export const Ranking = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const planetUid = searchParams.get("planetUid");
    const userUid = searchParams.get("userUid");
    const wrapperRef = useRef<HTMLDivElement>(null);
    const userRankRow = useRef<HTMLTableRowElement>(null);
    const getRanks = useStore((state) => state.getRanks);
    const user = useStore((state) => state.user);
    const ranks = useStore((state) => state.ranks);
    const userRankPage = Math.ceil(
        ranks.find((rank) => rank.userUid === (userUid ? userUid : user.uid))!
            .rank / ENTRIES_PER_PAGE
    );
    const [page, setPage] = useState(userRankPage);
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

    useEffect(() => {
        getRanks().finally(() => {
            setIsLoading(false);
        });
    }, [getRanks]);

    useEffect(() => {
        if (userRankRow.current) {
            userRankRow.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        } else {
            wrapperRef.current?.scrollTo({ top: 0 });
        }
    }, [page, isLoading]);

    const getPaginatedEntries = (page: number) => {
        if (page === 1) {
            return ranks.slice(0, ENTRIES_PER_PAGE);
        }

        const start = (page - 1) * ENTRIES_PER_PAGE;
        return ranks.slice(start, start + ENTRIES_PER_PAGE);
    };

    return (
        <VStack
            ref={wrapperRef}
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
                        <Heading color="gray.100">Ranking</Heading>
                        <TableContainer w="full">
                            <Table size="sm">
                                <Thead>
                                    <Tr>
                                        <Th>Rank</Th>
                                        <Th>Username</Th>
                                        <Th isNumeric>Points</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {isLoading
                                        ? Array.from({ length: 10 }).map(
                                              (_, index) => (
                                                  <Tr
                                                      key={index}
                                                      paddingBottom="10px"
                                                  >
                                                      <Td>
                                                          <Skeleton height="40px" />
                                                      </Td>
                                                      <Td>
                                                          <Skeleton height="40px" />
                                                      </Td>
                                                      <Td isNumeric>
                                                          <Skeleton height="40px" />
                                                      </Td>
                                                  </Tr>
                                              )
                                          )
                                        : getPaginatedEntries(page).map(
                                              (rank) => (
                                                  <Tr
                                                      key={rank.userUid}
                                                      backgroundColor={
                                                          rank.userUid ===
                                                          userUid
                                                              ? "cyan.800"
                                                              : rank.userUid ===
                                                                user.uid
                                                              ? "blue.800"
                                                              : undefined
                                                      }
                                                      ref={
                                                          userUid &&
                                                          rank.userUid ===
                                                              userUid
                                                              ? userRankRow
                                                              : !userUid &&
                                                                rank.userUid ===
                                                                    user.uid
                                                              ? userRankRow
                                                              : undefined
                                                      }
                                                  >
                                                      <Td>
                                                          <HStack spacing={8}>
                                                              <Text>
                                                                  {rank.rank}
                                                              </Text>{" "}
                                                              <RankDifference
                                                                  difference={
                                                                      rank.difference
                                                                  }
                                                              />
                                                          </HStack>
                                                      </Td>
                                                      <Td>
                                                          <Text>
                                                              {rank.username}
                                                          </Text>
                                                      </Td>
                                                      <Td isNumeric>
                                                          <Badge
                                                              fontSize="lg"
                                                              colorScheme="blue"
                                                              p={2}
                                                          >
                                                              {formatter.format(
                                                                  Math.floor(
                                                                      rank.points /
                                                                          1000
                                                                  )
                                                              )}
                                                          </Badge>
                                                      </Td>
                                                  </Tr>
                                              )
                                          )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Center w="full">
                            <Pagination
                                page={page}
                                entriesCount={ranks.length}
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
