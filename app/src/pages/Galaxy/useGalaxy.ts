import { useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useStore } from "../../store/store";

export const ANIMATION_TIME = 300;

type UseGalaxyProps = {
    isLoaded: boolean;
    xOverscan: number;
    yOverscan: number;
}

export const useGalaxy = (props: UseGalaxyProps) => {
    const { isLoaded, xOverscan, yOverscan } = props;
    const [searchParams, setSearchParams] = useSearchParams();
    const isMoving = useRef(false);
    const xParam = searchParams.get("x");
    const yParam = searchParams.get("y");
    const getGalaxy = useStore((state) => state.getGalaxy);
    const galaxy = useStore((state) => state.galaxy);

    const x = Number.parseInt(xParam || "0", 10);
    const y = Number.parseInt(yParam || "0", 10);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        if (!xParam || !yParam) {
            setSearchParams(
                {
                    x: "0",
                    y: "0",
                },
                {
                    replace: true,
                }
            );

            getGalaxy(0, 0, xOverscan, yOverscan);
        } else {
            getGalaxy(0, 0, xOverscan, yOverscan);
        }
    }, [isLoaded]);

    const move = (direction: "LEFT" | "RIGHT" | "TOP" | "BOTTOM") => {
        if (isMoving.current) {
            return;
        }

        isMoving.current = true;

        const updatedX =
            direction === "LEFT" ? x - 1 : direction === "RIGHT" ? x + 1 : x;
        const updatedY =
            direction === "TOP" ? y - 1 : direction === "BOTTOM" ? y + 1 : y;

        setTimeout(() => (isMoving.current = false), ANIMATION_TIME + 10);

        setSearchParams(
            {
                x: updatedX.toString(),
                y: updatedY.toString(),
            },
            {
                replace: true,
            }
        );

        if (
            galaxy.get(
                `${direction === "LEFT"
                    ? updatedX - xOverscan
                    : direction === "RIGHT"
                        ? updatedX + xOverscan
                        : updatedX
                }:${direction === "TOP"
                    ? updatedY - yOverscan
                    : direction === "BOTTOM"
                        ? updatedY + yOverscan
                        : updatedY
                }`
            ) === undefined
        ) {
            getGalaxy(
                updatedX > x
                    ? updatedX + 2 * xOverscan
                    : updatedX < x
                        ? updatedX - 2 * xOverscan
                        : updatedX,
                updatedY > y
                    ? updatedY + 2 * yOverscan
                    : updatedY < y
                        ? updatedY - 2 * yOverscan
                        : updatedY,
                xOverscan,
                yOverscan
            );
        }
    };

    return { x, y, move };
};