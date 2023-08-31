import { ActionMenuAction } from "../../store/types";

export const getActionMenuActionLabel = (action: ActionMenuAction) => {
    switch (action) {
        case ActionMenuAction.BUILD_FLEET:
            return "Build Light Fighter";
        default:
            return "";
    }
};