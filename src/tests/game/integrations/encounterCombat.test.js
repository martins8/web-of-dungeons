import EncounterCombat from "src/game/orchestrators/encounterCombat";
import SeedRNG from "src/game/rng/seedRNG";
import Character from "src/game/entities/character";
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";

const validAttributes = {
  sta: 12,
  str: 12,
  con: 12,
  dex: 10,
  int: 8,
  wis: 8,
  agi: 8,
  cha: 8,
};

describe("Integration - EncounterCombat", () => {
  test("player clears full encounter with deterministic flow and valid state transitions", () => {
    // 🎲 RNG determinístico
    const rng = new SeedRNG(12345);

    const player = new Character("hero", validAttributes, physicalSkillsList);

    const encounterDefinition = {
      rounds: 3,
      pool: [
        { id: "rat_01", weight: 1 },
        { id: "wolf_01", weight: 1 },
        //{ id: "bandit_01", weight: 1 },
        //{ id: "bandit_02", weight: 1 },
        //{ id: "mage_01", weight: 1 },
      ],
    };

    const encounterCombat = new EncounterCombat(player, encounterDefinition, {
      rng,
    });

    encounterCombat.start();

    let safetyCounter = 0;
    const MAX_ACTIONS = 100;

    // 🔁 Loop principal do encounter
    while (!encounterCombat.finished) {
      const combat = encounterCombat.currentCombat;

      expect(combat).toBeDefined();
      expect(combat.finished).toBe(false);

      const attacker = combat.getCurrentAttacker();
      const skill = attacker.skills[0];

      const result = encounterCombat.performAction(skill.id);

      // 🔍 contrato de retorno
      if (typeof result === "object") {
        expect(result).toHaveProperty("ok");
        expect(result).toHaveProperty("reason");
      } else {
        expect(typeof result).toBe("string");
        expect(result.length).toBeGreaterThan(0);
      }

      safetyCounter++;
      if (safetyCounter > MAX_ACTIONS) {
        throw new Error("Infinite loop detected in EncounterCombat");
      }
    }
    console.log(encounterCombat.log);

    // 🧪 ASSERTS DE ESTADO ANTES DO .end()
    expect(encounterCombat.finished).toBe(true);
    expect(encounterCombat.currentCombatIndex).toBe(3);

    // player ainda tem estado válido aqui
    expect(player.combatState.currentHp).toBeGreaterThan(0);
    expect(player.combatState.isDead()).toBe(false);

    // log consolidado do encounter
    expect(encounterCombat.log.length).toBeGreaterThan(0);

    // 🧹 cleanup final do encounter
    const endResult = encounterCombat.end();
    expect(endResult.ok).toBe(true);
    expect(endResult.reason).toBe("ENCOUNTER_FINISHED");
  });
});
