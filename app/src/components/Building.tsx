import { MouseEventHandler, memo } from "react";
import { VStack, Text, Box, useBreakpointValue } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Building as BuildingType, EntityType } from "../types/types";
import { getBuildingImage, getBuildingLabel } from "../utils/building";
import { Actionable } from "./ActionMenu/Actionable";
import { useStore } from "../store/store";
import { Button } from "./Button";
import { ActionMenuAction } from "../store/types";

type BuildingProps = {
    building: BuildingType;
};

export const Building = memo((props: BuildingProps) => {
    const { building } = props;
    const openMenu = useStore((state) => state.openMenu);
    const label = getBuildingLabel(building.type);
    const image = getBuildingImage(building.type);

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
        openMenu(
            ActionMenuAction.BUILDING_SELECTION,
            event.target as HTMLButtonElement,
            {
                uid: building.uid,
                type: EntityType.BUILDING,
            }
        );
    };

    return (
        <Actionable>
            <Button
                onClick={handleClick}
                h={["160px", "200px"]}
                w={["160px", "200px"]}
                px={[4, 6]}
                py={[2, 4]}
                position="relative"
            >
                <VStack spacing={[1, 2]} h="full">
                    <Box flex="1" overflow="hidden">
                        <Image src={`/assets/${image}`} h="100%" w="100%" />
                    </Box>
                    <Text fontSize="lg">{label}</Text>
                </VStack>
                <Text
                    position="absolute"
                    top={["8px", "16px"]}
                    right={["8px", "16px"]}
                    fontSize={["2xl", "3xl"]}
                >
                    {building.level}
                </Text>
            </Button>
        </Actionable>
    );
});
