import { useState } from "react";
import { Editable, EditablePreview, EditableInput } from "@chakra-ui/react";
import { Planet } from "../types/types";
import { useStore } from "../store/store";

type PlanetNameProps = {
    planet: Planet;
};

export const PlanetName = (props: PlanetNameProps) => {
    const { planet } = props;
    const [name, setName] = useState(planet.name);
    const updatePlanetName = useStore((state) => state.updatePlanetName);

    const handleNameChange = async (value: string) => {
        const trimmedName = value.trim();

        if (trimmedName === planet.name) {
            return;
        }

        try {
            await updatePlanetName(planet.uid, trimmedName);
        } catch {
            setName(planet.name);
        }
    };

    return (
        <Editable
            value={name}
            onChange={setName}
            defaultValue={planet.name}
            onSubmit={handleNameChange}
        >
            <EditablePreview fontSize="4xl" fontWeight="bold" />
            <EditableInput fontSize="4xl" fontWeight="bold" />
        </Editable>
    );
};
