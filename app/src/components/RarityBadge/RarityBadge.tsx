import { useToken } from "@chakra-ui/react";
import { Rarity } from "../../types/types";
import {
    getRarityBackgroundColor,
    getRarityBackgroundHoverColor,
    getRarityColor,
    getRarityLabel,
    getRarityLevel,
} from "../../utils/rarity";
import "./RarityBadge.css";

type RarityBadgeProps = {
    rarity: Rarity;
};

export const RarityBadge = (props: RarityBadgeProps) => {
    const { rarity } = props;
    const borderColor = useToken("colors", getRarityColor(rarity));
    const backgroundColor = useToken(
        "colors",
        getRarityBackgroundHoverColor(rarity)
    );
    const backgroundColorSubtle = useToken(
        "colors",
        getRarityBackgroundColor(rarity)
    );

    return (
        <>
            <div
                className={`RarityBadge${
                    getRarityLevel(rarity) >= getRarityLevel(Rarity.RARE)
                        ? " glow"
                        : ""
                }${
                    getRarityLevel(rarity) >= getRarityLevel(Rarity.EPIC)
                        ? " pulse"
                        : ""
                }`}
                style={{
                    borderColor,
                    backgroundColor,
                    "--glow-background": backgroundColor,
                    "--glow-background-subtle": backgroundColorSubtle,
                }}
            >
                {getRarityLevel(rarity) >= getRarityLevel(Rarity.LEGENDARY) && (
                    <div className="shineWrapper">
                        <div className="shine" />
                    </div>
                )}
                {getRarityLabel(rarity)}
            </div>
        </>
    );
};
