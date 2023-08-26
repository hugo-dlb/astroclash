import {
    faChevronUp,
    faChevronLeft,
    faChevronRight,
    faChevronDown,
} from "@fortawesome/pro-regular-svg-icons";
import { FaIconButton } from "../../components/FaIcon";
import { useGalaxy } from "./useGalaxy";
import { useHotkeys } from "react-hotkeys-hook";

type GalaxyControlsProps = {
    containerWidth: number;
    containerHeight: number;
    move: ReturnType<typeof useGalaxy>["move"];
};

export const GalaxyControls = (props: GalaxyControlsProps) => {
    const { containerWidth, containerHeight, move } = props;

    useHotkeys("up", () => move("TOP"));
    useHotkeys("right", () => move("RIGHT"));
    useHotkeys("down", () => move("BOTTOM"));
    useHotkeys("left", () => move("LEFT"));

    return (
        <>
            <FaIconButton
                position="absolute"
                left={`calc(${containerWidth / 2}px - 20px)`}
                top="124px"
                variant="ghost"
                aria-label="Navigate to the top"
                tooltip="Navigate to the top"
                icon={faChevronUp}
                fontSize="3xl"
                color="blue.300"
                onClick={() => move("TOP")}
            />
            <FaIconButton
                position="absolute"
                top={`calc(${containerHeight / 2}px - 20px)`}
                left="24px"
                variant="ghost"
                aria-label="Navigate to the left"
                tooltip="Navigate to the left"
                icon={faChevronLeft}
                fontSize="3xl"
                color="blue.300"
                onClick={() => move("LEFT")}
            />
            <FaIconButton
                position="absolute"
                top={`calc(${containerHeight / 2}px - 20px)`}
                right="24px"
                variant="ghost"
                aria-label="Navigate to the right"
                tooltip="Navigate to the right"
                icon={faChevronRight}
                fontSize="3xl"
                color="blue.300"
                onClick={() => move("RIGHT")}
            />
            <FaIconButton
                position="absolute"
                left={`calc(${containerWidth / 2}px - 20px)`}
                bottom="24px"
                variant="ghost"
                aria-label="Navigate to the bottom"
                tooltip="Navigate to the bottom"
                icon={faChevronDown}
                fontSize="3xl"
                color="blue.300"
                onClick={() => move("BOTTOM")}
            />
        </>
    );
};
