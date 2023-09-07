import { cloneDeep } from "lodash";
import { useStore } from "../store/store";
import { Event, MessageType } from "../types/types";

export const handleSocketEvent = (event: Event) => {
    const { user, missions } = useStore.getState();
    const missionIndex = missions.findIndex(mission => mission.uid === event.data.mission.uid);
    const updatedMissions = cloneDeep(missions);

    switch (event.type) {
        case MessageType.MissionReturn:
            useStore.setState({
                user: {
                    ...user,
                    messages: [event.data.message, ...user.messages]
                },
                missions: missions.filter(mission => mission.uid !== event.data.message.uid)
            });
            break;
        case MessageType.MissionResult:
            updatedMissions[missionIndex] = event.data.mission;
            useStore.setState({
                user: {
                    ...user,
                    messages: [event.data.message, ...user.messages]
                },
                missions: missions.filter(mission => mission.uid !== event.data.message.uid)
            });
            break;
        default:
            break;
    }
};