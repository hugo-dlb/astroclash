import { Fleet } from "@prisma/client";
import { getFleetAttackPoints, getFleetHealthPoints } from "./fleet";

const BATTLE_ROUNDS = 10;

const extendFleet = (fleet: Fleet[]) => {
    return fleet.map(spaceship => ({
        ...spaceship,
        healthPoints: getFleetHealthPoints(spaceship.type, spaceship.level, spaceship.rarity),
        attackPoints: getFleetAttackPoints(spaceship.type, spaceship.level, spaceship.rarity),
    }));
};

export const executeBattle = (defender: Fleet[], attacker: Fleet[]) => {
    let defenderRemainingFleet = extendFleet(defender);
    let attackerRemainingFleet = extendFleet(attacker);
    const defenderLostFleet = [];
    const attackerLostFleet = [];

    let ROUNDS_LEFT = defender.length === 0 ? 0 : BATTLE_ROUNDS;
    while (ROUNDS_LEFT > 0) {
        const roundAttackerRemainingFleet = [...attackerRemainingFleet];
        const roundDefenderRemainingFleet = [...defenderRemainingFleet];

        for (const fleet of attackerRemainingFleet) {
            const target = roundDefenderRemainingFleet[Math.floor(Math.random() * roundDefenderRemainingFleet.length)];
            target.healthPoints -= fleet.attackPoints;

            if (target.healthPoints <= 0) {
                defenderLostFleet.push(target);
                roundDefenderRemainingFleet.splice(roundDefenderRemainingFleet.indexOf(target), 1);
            }

            if (roundDefenderRemainingFleet.length === 0) {
                break;
            }
        }

        for (const fleet of defenderRemainingFleet) {
            const target = roundAttackerRemainingFleet[Math.floor(Math.random() * roundAttackerRemainingFleet.length)];
            target.healthPoints -= fleet.attackPoints;

            if (target.healthPoints <= 0) {
                attackerLostFleet.push(target);
                roundAttackerRemainingFleet.splice(roundAttackerRemainingFleet.indexOf(target), 1);
            }

            if (roundAttackerRemainingFleet.length === 0) {
                break;
            }
        }

        attackerRemainingFleet = [...roundAttackerRemainingFleet];
        defenderRemainingFleet = [...roundDefenderRemainingFleet];

        if (roundAttackerRemainingFleet.length === 0 || roundDefenderRemainingFleet.length === 0) {
            break;
        }

        ROUNDS_LEFT--;
    }

    return {
        defenderRemainingFleet,
        attackerRemainingFleet,
        defenderLostFleet,
        attackerLostFleet
    };
};