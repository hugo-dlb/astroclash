import { HStack, Select, Text } from "@chakra-ui/react";
import { FaIconButton } from "../FaIcon";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/pro-regular-svg-icons";

type PaginationProps = {
    page: number;
    entriesCount: number;
    entriesPerPage?: number;
    onChange: (page: number) => void;
};

export const Pagination = (props: PaginationProps) => {
    const { page, entriesCount, entriesPerPage = 20, onChange } = props;
    const pageCount = Math.ceil(entriesCount / entriesPerPage);

    const firstItem = page === 1 ? 1 : (page - 1) * entriesPerPage + 1;
    const lastItem =
        page === pageCount ? entriesCount : firstItem + entriesPerPage - 1;

    return (
        <HStack justifyContent="end" w="full">
            <HStack justifyContent="center" w="33%">
                <Text display="inline-block">
                    {firstItem} - {lastItem} of {entriesCount}
                </Text>
            </HStack>
            <HStack justifyContent="right" w="33%" spacing={4}>
                <HStack>
                    <Text>Page</Text>
                    <Select
                        value={page}
                        w={pageCount > 999 ? "120px" : "76px"}
                        onChange={(event) =>
                            onChange(
                                Number.parseInt(event?.target.value, 10) || 1
                            )
                        }
                    >
                        {Array.from({ length: pageCount }).map((_, index) => (
                            <option key={index + 1} value={index + 1}>
                                {index + 1}
                            </option>
                        ))}
                    </Select>
                    <Text flexShrink={0}>of {pageCount}</Text>
                </HStack>
                <HStack marginRight={1}>
                    <FaIconButton
                        aria-label="Previous page"
                        icon={faChevronLeft}
                        isDisabled={page === 1}
                        variant="ghost"
                        tooltip="Previous page"
                        onClick={() => onChange(page - 1)}
                    />
                    <FaIconButton
                        aria-label="Next page"
                        icon={faChevronRight}
                        isDisabled={page === pageCount}
                        variant="ghost"
                        tooltip="Next page"
                        onClick={() => onChange(page + 1)}
                    />
                </HStack>
            </HStack>
        </HStack>
    );
};
