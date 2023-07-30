import { ThemeConfig, extendTheme, Text, Input, Skeleton, theme as baseTheme, defineStyle } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";

Text.defaultProps = {
    fontSize: "lg"
};

Input.defaultProps = {
    ...Input.defaultProps,
    variant: "filled"
};

Skeleton.defaultProps = {
    ...Skeleton.defaultProps,
    startColor: "blue.600",
    endColor: "blue.800"
};

const config: ThemeConfig = {
    initialColorMode: 'dark',
    useSystemColorMode: false,
};

const breakpoints = {
    base: "0em",
    sm: "30em",
    md: "64em",
    lg: "80em",
    xl: "96em",
    "2xl": "120em",
    "3xl": "164em",
};

type AccessibleColor = {
    bg?: string
    color?: string
    hoverBg?: string
    activeBg?: string
}

const accessibleColorMap: { [key: string]: AccessibleColor } = {
    yellow: {
        bg: "yellow.400",
        color: "black",
        hoverBg: "yellow.500",
        activeBg: "yellow.600",
    },
    cyan: {
        bg: "cyan.400",
        color: "black",
        hoverBg: "cyan.500",
        activeBg: "cyan.600",
    },
};

export const theme = extendTheme({
    config,
    breakpoints,
    fonts: {
        heading: `Roboto, Helvetica, Arial !important`,
        body: `Roboto, Helvetica, Arial !important`,
    },
    components: {
        Table: {
            variants: {
                simple: {
                    th: {
                        borderColor: "blue.700"
                    },
                    td: {
                        borderColor: "blue.700"
                    }
                }
            }
        },
        Button: {
            baseStyle: {
                ...baseTheme.components.Button.baseStyle,
                fontWeight: "normal",
            },
            variants: {
                ...baseTheme.components.Button.variants,
                solid: defineStyle((props) => {
                    const { colorScheme: c } = props;

                    if (c === "gray") {
                        const bg = mode(`gray.100`, `whiteAlpha.200`)(props);

                        return {
                            bg,
                            _hover: {
                                bg: mode(`gray.200`, `whiteAlpha.300`)(props),
                                _disabled: {
                                    bg,
                                },
                            },
                            _active: { bg: mode(`gray.300`, `whiteAlpha.400`)(props) },
                        };
                    }

                    const {
                        bg = `${c}.500`,
                        color = "white",
                        hoverBg = `${c}.600`,
                        activeBg = `${c}.700`,
                    } = accessibleColorMap[c] ?? {};

                    const background = mode(bg, `${c}.300`)(props);

                    return {
                        bg: background,
                        color: mode(color, `gray.800`)(props),
                        _hover: {
                            bg: mode(hoverBg, `${c}.300`)(props),
                            _disabled: {
                                bg: background,
                            },
                        },
                        _active: { bg: mode(activeBg, `${c}.400`)(props) },
                    };
                })
            }
        },
        Popover: {
            baseStyle: {
                content: {
                    bg: "blue.800",
                    borderColor: "blue.700",
                    borderWidth: "2px",
                },
            },
            defaultProps: {},
        },
    }
});