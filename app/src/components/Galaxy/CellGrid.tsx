import { Box } from "@chakra-ui/react";

type CellGridProps = {
    left: number;
    top: number;
    gridSize: number;
    animationTime: number;
};

export const CellGrid = (props: CellGridProps) => {
    const { left, top, gridSize, animationTime } = props;

    return (
        <Box
            position="absolute"
            transform={`translate(${left}px, ${top}px)`}
            w={`${gridSize}px`}
            h={`${gridSize}px`}
            transition={`all ${animationTime}ms`}
        >
            <Box
                position="absolute"
                borderWidth="1px"
                borderColor="blue.500"
                top="0"
                left="0"
                right="0"
                bottom="0"
            />
        </Box>
    );
};
