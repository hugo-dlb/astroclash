import { ReactElement } from "react";
import { Box } from "@chakra-ui/react";
import { ACTIONABLE_CLASS } from "./isWithinActionable";

type ActionableProps = {
    children: ReactElement;
};

export const Actionable = (props: ActionableProps) => {
    const { children } = props;

    return <Box className={ACTIONABLE_CLASS}>{children}</Box>;
};
