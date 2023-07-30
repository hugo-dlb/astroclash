import { Box, useOutsideClick } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { isWithinActionable } from "./isWithinActionable";
import { BuildingMenu } from "./BuildingMenu";
import { ActionMenuAction, useStore } from "../../store/store";
import {
    selectBuilding,
    selectFleet,
    selectMission,
} from "../../store/selectors";
import { BuildFleetMenu } from "./BuildFleetMenu";
import { FleetMenu } from "./FleetMenu";
import { match } from "ts-pattern";
import { GalaxyPlanetMenu } from "./GalaxyPlanetMenu";
import { useParams } from "react-router-dom";
import { EntityReference } from "../../types/types";
import { MissionMenu } from "./MissionMenu";

const isEntityReference = (entity: any): entity is EntityReference => {
    return entity && entity.uid !== undefined && entity.type !== undefined;
};

export const ActionMenu = () => {
    const { planetUid } = useParams();
    const planet = useStore((state) =>
        state.planets.find((planet) => planet.uid === planetUid)
    );
    const actionMenu = useStore((state) => state.actionMenu);
    const missions = useStore((state) => state.missions);
    const { isOpen, action, entity } = actionMenu;
    const closeMenu = useStore((state) => state.closeMenu);
    const ref = useRef<HTMLDivElement>(null);

    useOutsideClick({
        ref: ref,
        handler: (event) => {
            if (
                event.target &&
                isWithinActionable(event.target as HTMLElement)
            ) {
                return;
            }
            closeMenu();
        },
    });

    return (
        <motion.div
            variants={{
                open: {
                    opacity: 1,
                    visibility: "visible",
                    transition: {
                        duration: 0.1,
                    },
                },
                closed: {
                    opacity: 0,
                    visibility: "hidden",
                    transition: {
                        duration: 0,
                    },
                },
            }}
            animate={isOpen ? "open" : "closed"}
            style={{
                position: "fixed",
                bottom: "32px",
                left: "50%",
                translateX: "-50%",
            }}
        >
            {
                <Box
                    ref={ref}
                    borderRadius="md"
                    backgroundColor="blue.700"
                    p={4}
                    paddingTop={2}
                    h="162px"
                    boxShadow="md"
                >
                    {match(action)
                        .with(
                            ActionMenuAction.BUILD_FLEET,
                            () => planet && <BuildFleetMenu planet={planet} />
                        )
                        .with(
                            ActionMenuAction.BUILDING_SELECTION,
                            () =>
                                planet &&
                                isEntityReference(entity) && (
                                    <BuildingMenu
                                        planet={planet!}
                                        building={selectBuilding(
                                            planet,
                                            entity.uid
                                        )}
                                    />
                                )
                        )
                        .with(
                            ActionMenuAction.FLEET_SELECTION,
                            () =>
                                planet &&
                                isEntityReference(entity) && (
                                    <FleetMenu
                                        planet={planet!}
                                        fleet={selectFleet(planet, entity.uid)}
                                    />
                                )
                        )
                        .with(
                            ActionMenuAction.MISSION_SELECTION,
                            () =>
                                isEntityReference(entity) && (
                                    <MissionMenu
                                        mission={selectMission(
                                            missions,
                                            entity.uid
                                        )}
                                    />
                                )
                        )
                        // Galaxy planet selection is the only case where the entity is not reactive
                        // because it would be a hassle to find it in the store.
                        .with(
                            ActionMenuAction.GALAXY_PLANET_SELECTION,
                            () =>
                                entity &&
                                !isEntityReference(entity) && (
                                    <GalaxyPlanetMenu planet={entity} />
                                )
                        )
                        .with(ActionMenuAction.EMPTY, () => null)
                        .exhaustive()}
                </Box>
            }
        </motion.div>
    );
};
