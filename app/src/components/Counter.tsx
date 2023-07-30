import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
import { Text } from "@chakra-ui/react";

const formatter = new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 0,
});

type CounterProps = {
    value: number;
};

export const Counter = (props: CounterProps) => {
    const { value } = props;
    const previousValue = useRef(value);
    const nodeRef = useRef<HTMLParagraphElement | null>(null);

    useEffect(() => {
        const node = nodeRef.current;

        if (!node) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            return () => {};
        }

        const controls = animate(previousValue.current, value, {
            duration: 1,
            onUpdate(value) {
                node.textContent = formatter.format(Math.floor(value));
            },
        });

        previousValue.current = value;

        return () => controls.stop();
    }, [value]);

    return <Text fontSize="lg" ref={nodeRef} />;
};
