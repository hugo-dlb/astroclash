import { Tooltip, Center } from "@chakra-ui/react";
import { faBan } from "@fortawesome/pro-regular-svg-icons";
import { FaIcon } from "./FaIcon";
import { Button } from "./Button";

export const CannotBuildFleetButton = () => {
    return (
        <Tooltip
            label="Upgrade your Space dock to expand your fleet capacity"
            placement="right"
        >
            <Button
                color="blue.900"
                w={["108px", "128px"]}
                h={["108px", "128px"]}
            >
                <Center h="100%">
                    <FaIcon icon={faBan} size="2xl" />
                </Center>
            </Button>
        </Tooltip>
    );
};
