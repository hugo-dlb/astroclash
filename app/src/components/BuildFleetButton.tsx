import { MouseEventHandler } from "react";
import { Center } from "@chakra-ui/react";
import { faAdd } from "@fortawesome/pro-light-svg-icons";
import { FaIcon } from "./FaIcon";
import { useStore } from "../store/store";
import { Actionable } from "./ActionMenu/Actionable";
import { Button } from "./Button";
import { ActionMenuAction } from "../store/types";

export const BuildFleetButton = () => {
    const openMenu = useStore((store) => store.openMenu);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        openMenu(
            ActionMenuAction.BUILD_FLEET,
            event.target as HTMLButtonElement
        );
    };

    return (
        <Actionable>
            <Button
                onClick={handleClick}
                w={["108px", "128px"]}
                h={["108px", "128px"]}
            >
                <Center h="100%">
                    <FaIcon icon={faAdd} size="2xl" />
                </Center>
            </Button>
        </Actionable>
    );
};
