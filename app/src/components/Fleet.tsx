import { MouseEventHandler, memo } from "react";
import { VStack, Tooltip, Text, Box, Fade } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { getFleetImage, getFleetExtendedLabel } from "../utils/fleet";
import { Fleet as FleetType } from "../types/types";
import {
    getRarityBackgroundColor,
    getRarityBackgroundHoverColor,
    getRarityColor,
} from "../utils/rarity";
import { Actionable } from "./ActionMenu/Actionable";
import { Button } from "./Button";
import { FaIcon } from "./FaIcon";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";

type FleetButtonProps = {
    fleet: FleetType;
    size?: "xs" | "normal";
    isSelected?: boolean;
    hasLowOpacity?: boolean;
    lowOpacityIcon?: IconDefinition;
    isNonActionable?: boolean;
    onClick?: (source: HTMLButtonElement, fleet: FleetType) => void;
};

export const Fleet = memo((props: FleetButtonProps) => {
    const {
        fleet,
        size = "normal",
        hasLowOpacity,
        lowOpacityIcon,
        isNonActionable = false,
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        onClick = () => {},
    } = props;
    const image = getFleetImage(fleet.type);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        if (!isNonActionable) {
            onClick(event.target as HTMLButtonElement, fleet);
        }
    };

    return (
        <Actionable>
            <Tooltip label={getFleetExtendedLabel(fleet)}>
                <Box position="relative">
                    <Button
                        position="relative"
                        w={size === "xs" ? "40px" : "128px"}
                        h={size === "xs" ? "40px" : "128px"}
                        p={0}
                        borderWidth="2px"
                        borderColor={getRarityColor(fleet.rarity)}
                        backgroundColor={getRarityBackgroundColor(fleet.rarity)}
                        _hover={{
                            backgroundColor: getRarityBackgroundHoverColor(
                                fleet.rarity
                            ),
                        }}
                        onClick={handleClick}
                        opacity={hasLowOpacity ? 0.5 : 1}
                        isNonActionable={isNonActionable}
                    >
                        <VStack>
                            {size === "normal" && (
                                <Image
                                    transform="translateZ(0)"
                                    src={`/assets/${image}`}
                                />
                            )}
                            <Text
                                position={
                                    size === "normal" ? "absolute" : undefined
                                }
                                top={size === "normal" ? "8px" : undefined}
                                right={size === "normal" ? "8px" : undefined}
                                fontSize="xl"
                            >
                                {fleet.level}
                            </Text>
                        </VStack>
                    </Button>
                    <Fade in={hasLowOpacity}>
                        {lowOpacityIcon && (
                            <FaIcon
                                icon={lowOpacityIcon}
                                size="2xl"
                                color="blue.100"
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                pointerEvents="none"
                            />
                        )}
                    </Fade>
                </Box>
            </Tooltip>
        </Actionable>
    );
});
