import { create } from "zustand";
import { getActions } from "./actions";
import { ActionMenuAction, Actions, State } from "./types";

export const defaultState: State = {
    user: {
        uid: "",
        username: "",
        email: "",
        messages: []
    },
    planets: [],
    actionMenu: {
        isOpen: false,
        action: ActionMenuAction.EMPTY
    },
    ranks: [],
    missions: [],
    galaxy: new Map()
};

export const useStore = create<State & Actions>(
    (set, get) => {
        const store: State & Actions = {
            ...defaultState,
            ...getActions(set, get),
        };

        return store;
    }
);