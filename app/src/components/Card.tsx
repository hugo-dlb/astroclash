import { Box } from "@chakra-ui/react";
import { ReactElement } from "react";

type CardProps = {
    children: ReactElement;
};

export const Card = (props: CardProps) => {
    const { children } = props;

    return (
        <Box w="full" borderRadius="md" backgroundColor="blue.800" p={4}>
            {children}
        </Box>
    );
};
