import { HStack, Text } from "@chakra-ui/react";
import { FaIcon } from "./FaIcon";
import {
    faChevronDown,
    faChevronUp,
    faEquals,
} from "@fortawesome/pro-regular-svg-icons";

type RankDifferenceProps = {
    difference: number;
};

export const RankDifference = (props: RankDifferenceProps) => {
    const { difference } = props;

    if (difference === 0) {
        return (
            <HStack>
                <FaIcon icon={faEquals} color="gray.500" />{" "}
                <Text fontSize="sm">0</Text>
            </HStack>
        );
    }

    if (difference > 0) {
        return (
            <HStack>
                <FaIcon icon={faChevronUp} color="green.500" />{" "}
                <Text fontSize="md" color="green.400">
                    +{difference}
                </Text>
            </HStack>
        );
    }

    return (
        <HStack>
            <FaIcon icon={faChevronDown} color="red.500" />{" "}
            <Text fontSize="md" color="red.400">
                {difference}
            </Text>
        </HStack>
    );
};
