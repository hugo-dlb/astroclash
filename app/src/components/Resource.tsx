import { HStack, Image, Tooltip } from "@chakra-ui/react";
import { getResourceImage, getResourceLabel } from "../utils/resource";
import { Resource as ResourceType } from "../types/types";
import { Counter } from "./Counter";

type ResourceProps = {
    resource: ResourceType;
};

export const Resource = (props: ResourceProps) => {
    const { resource } = props;
    const label = getResourceLabel(resource.type);
    const image = getResourceImage(resource.type);

    return (
        <Tooltip key={resource.type} label={label} placement="left">
            <HStack>
                <Image src={`/assets/${image}`} h="48px" />
                <Counter value={resource.value} />
            </HStack>
        </Tooltip>
    );
};
