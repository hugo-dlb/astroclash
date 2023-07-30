import {
    chakra,
    forwardRef,
    Placement,
    StyleProps,
    Tooltip,
} from "@chakra-ui/react";
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

type FaIconProps = Pick<FontAwesomeIconProps, "color" | "size"> & {
    icon: IconDefinition;
} & StyleProps;

export const FaIcon = (props: FaIconProps) => {
    const { icon, ...rest } = props;
    const Icon = chakra(FontAwesomeIcon);

    return <Icon icon={icon} {...rest} />;
};

type FaIconButtonProps = Omit<IconButtonProps, "icon"> & {
    icon: IconDefinition;
    iconColor?: string;
    tooltip?: string;
    tooltipPlacement?: Placement;
};

export const FaIconButton = forwardRef<FaIconButtonProps, "button">(
    (props, ref) => {
        const { icon, iconColor, tooltip, tooltipPlacement, ...otherProps } =
            props;

        if (tooltip) {
            return (
                <Tooltip label={tooltip} placement={tooltipPlacement}>
                    <IconButton
                        ref={ref}
                        icon={<FaIcon icon={icon} />}
                        color={iconColor}
                        {...otherProps}
                    />
                </Tooltip>
            );
        }

        return (
            <IconButton
                ref={ref}
                icon={<FaIcon icon={icon} />}
                {...otherProps}
            />
        );
    }
);
