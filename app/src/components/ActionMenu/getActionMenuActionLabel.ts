import { ActionMenuAction } from "../../store/store";

export const getActionMenuActionLabel = (action: ActionMenuAction) => {
    switch (action) {
        case ActionMenuAction.BUILD_FLEET:
            return "Build Light Fighter";
        default:
            return "";
    }
};