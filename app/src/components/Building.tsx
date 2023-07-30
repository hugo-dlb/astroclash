import { MouseEventHandler, memo } from "react";
import { VStack, Text } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { Building as BuildingType, EntityType } from "../types/types";
import { getBuildingImage, getBuildingLabel } from "../utils/building";
import { Actionable } from "./ActionMenu/Actionable";
import { ActionMenuAction, useStore } from "../store/store";
import { Button } from "./Button";

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
            <Button onClick={handleClick} h="auto" px={6} py={4}>
                <VStack spacing={4} position="relative">
                    <Image src={`/assets/${image}`} h="128px" />
                    <Text fontSize="lg">{label}</Text>
                    <Text
                        position="absolute"
                        top="-8px"
                        right="-8px"
                        fontSize="3xl"
                    >
                        {building.level}
                    </Text>
                </VStack>
            </Button>
        </Actionable>
    );
});
