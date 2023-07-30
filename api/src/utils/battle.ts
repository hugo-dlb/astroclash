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
    const defenderRemainingFleet = extendFleet(defender);
    const attackerRemainingFleet = extendFleet(attacker);
    const defenderLostFleet = [];
    const attackerLostFleet = [];

    let ROUNDS_LEFT = BATTLE_ROUNDS;
    while (ROUNDS_LEFT > 0) {

        for (const fleet of attackerRemainingFleet) {
            const target = defenderRemainingFleet[Math.floor(Math.random() * defenderRemainingFleet.length)];
            target.healthPoints -= fleet.attackPoints;
            if (target.healthPoints <= 0) {
                defenderLostFleet.push(target);
                defenderRemainingFleet.splice(defenderRemainingFleet.indexOf(target), 1);
            }
        }

        for (const fleet of defenderRemainingFleet) {
            const target = attackerRemainingFleet[Math.floor(Math.random() * attackerRemainingFleet.length)];
            target.healthPoints -= fleet.attackPoints;
            if (target.healthPoints <= 0) {
                attackerLostFleet.push(target);
                attackerRemainingFleet.splice(attackerRemainingFleet.indexOf(target), 1);
            }
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