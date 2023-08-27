import { Box } from "@chakra-ui/react";

type CoordinatesProps = {
    x: number;
    y: number;
};

export const Coordinates = (props: CoordinatesProps) => {
    const { x, y } = props;

    return (
        <Box
            border="2px"
            borderColor="blue.700"
            borderRadius="md"
            p={2}
            px={4}
            position="absolute"
            background="blue.900"
            bottom="32px"
            right="32px"
            zIndex={5}
            fontSize="2xl"
        >
            {x} : {y}
        </Box>
    );
};
