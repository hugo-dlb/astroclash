import {
    Button as ChakraButton,
    ButtonProps as ChakraButtonProps,
    forwardRef,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

type ButtonProps = ChakraButtonProps & {
    buttonWidth?: string;
    buttonHeight?: string;
    isNonActionable?: boolean;
};

export const Button = forwardRef<ButtonProps, "button">((props, ref) => {
    const {
        children,
        onClick,
        isDisabled,
        buttonWidth,
        buttonHeight,
        isNonActionable = false,
        ...rest
    } = props;

    return (
        <motion.button
            whileHover={!isNonActionable ? { scale: 1.05 } : undefined}
            whileTap={!isNonActionable ? { scale: 0.95 } : undefined}
            onClick={onClick}
            disabled={isDisabled}
            style={{
                width: buttonWidth,
                height: buttonHeight,
            }}
        >
            <ChakraButton ref={ref} as="div" isDisabled={isDisabled} {...rest}>
                {children}
            </ChakraButton>
        </motion.button>
    );
});
