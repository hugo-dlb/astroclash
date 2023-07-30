export const ACTIONABLE_CLASS = "actionable";
export const CHAKRA_TOAST_CLASS = "chakra-toast";

export const isWithinActionable = (element: HTMLElement) => {
    let current: HTMLElement | null = element;

    if (!element.parentElement) {
        return false;
    }

    while (current) {
        if (current.classList.contains(ACTIONABLE_CLASS) ||
            current.classList.contains(CHAKRA_TOAST_CLASS)
        ) {
            return true;
        }

        current = current.parentElement;
    }

    return false;
};