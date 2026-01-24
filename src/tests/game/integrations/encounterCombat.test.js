import EncounterSystem from "src/game/systems/encounterSystem";
import Combat from "src/game/systems/combat";
import SeedRNG from "src/game/rng/seedRNG";
import Character from "src/game/entities/character";
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";
const validAttributes = {
  sta: 10,
  str: 10,
  con: 10,
  dex: 10,
  int: 10,
  wis: 10,
  agi: 10,
  cha: 10,
};

describe("Integration - Encounter → Combat", () => {
  test("player clears encounter without infinite loops", () => {
    const rng = new SeedRNG(12345);

    const character = new Character(
      "hero",
      validAttributes,
      physicalSkillsList,
    );

    const encounter = {
      rounds: 3,
      pool: [
        { id: "rat_01", weight: 1 },
        { id: "wolf_01", weight: 1 },
      ],
    };

    const encounterSystem = new EncounterSystem(encounter, { rng });
    const mobs = encounterSystem.generate();

    let combatsResolved = 0;
    for (const mob of mobs) {
      const combat = new Combat(character, mob, { rng });
      combat.start();

      while (!combat.finished) {
        const attacker = combat.getCurrentAttacker();
        const skill = attacker.skills[0];
        combat.performAction(skill.id);
      }
      combat.end();

      combatsResolved++;
      console.log(combat.combatLog);
    }

    expect(combatsResolved).toBe(3);
    expect(character.health.currentHp).toBeGreaterThan(0);
  });
});
