import { AttackProps } from "./Attack";

export const isAttackProps = (props: any): props is AttackProps => {
    return (
        props &&
        props.planet &&
        props.planet.coordinates
    );
};