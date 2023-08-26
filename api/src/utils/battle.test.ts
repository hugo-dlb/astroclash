import { Fleet, Rarity } from "@prisma/client";
import { executeBattle } from "./battle";

const anyFleet = (overrides: Partial<Fleet>): Fleet => ({
    uid: "e7c94bc2-a756-4db5-824a-8e595f19d3d5",
    level: 1,
    missionUid: "60eda289-3c10-424d-8b5f-e90c1670557a",
    planetUid: "60eda289-3c10-424d-8b5f-e90c1670557a",
    rarity: Rarity.COMMON,
    type: "LIGHT_FIGHTER",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides
});

it('executes a battle', () => {
    const attacker: Fleet[] = Array.from({ length: 10 }).map(() => anyFleet({
        level: 10,
        rarity: "UNCOMMON"
    }));
    const defender: Fleet[] = Array.from({ length: 5 }).map(() => anyFleet({
        level: 10,
        rarity: "UNCOMMON"
    }));

    const results = executeBattle(defender, attacker);

    expect(results.attackerRemainingFleet.length).toBe(10 - results.attackerLostFleet.length);
    expect(results.defenderRemainingFleet.length).toBe(5 - results.defenderLostFleet.length);
});