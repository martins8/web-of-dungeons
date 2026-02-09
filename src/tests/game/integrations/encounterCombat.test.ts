import EncounterCombat from "src/game/orchestrators/encounterCombat";
import SeedRNG from "src/game/rng/seedRNG";
import Character from "src/game/entities/character";
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";
import { EncounterDefinition } from "src/game/systems/encounterSystem";

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

const player = new Character({
  name: "hero",
  attrValues: validAttributes,
  skills: physicalSkillsList,
  equippedItems: {
    mainhand: {
      id: "starter_sword",
      type: "equipment",
      metadata: {
        name: "Starter Sword",
        description: "A basic sword for new adventurers.",
        rarity: "common",
      },
      equipmentItem: {
        slot: "mainhand",
        stats: {
          pDmg: 2,
        },
        weaponType: "sword",
        handedness: "one-hand",
        range: 1,
      },
    },
  },
});

describe("Integration - EncounterCombat", () => {
  test("player clears full encounter with deterministic flow and valid state transitions", () => {
    // 🎲 RNG determinístico
    const rng = new SeedRNG(12345);

    const encounterDefinition: EncounterDefinition = {
      type: "standard",
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
      expect(combat!.finished).toBe(false);

      const attacker = encounterCombat.player;
      const skill = attacker.skills[0];

      const result = encounterCombat.performAction(skill.id);
      // 🔍 contrato de retorno
      console.log("ActionResult:", result.data);

      expect(result).toHaveProperty("ok");
      expect(result).toHaveProperty("reason");
      expect(typeof result.ok).toBe("boolean");
      // reason can be a string for failures or null for successful actions
      expect(result.reason === null || typeof result.reason === "string").toBe(
        true,
      );

      safetyCounter++;
      if (safetyCounter > MAX_ACTIONS) {
        throw new Error("Infinite loop detected in EncounterCombat");
      }
    }
    //console.log(encounterCombat.textLog);
    //console.log(encounterCombat.eventLog);

    // 🧪 ASSERTS DE ESTADO ANTES DO .end()
    expect(encounterCombat.finished).toBe(true);
    expect(encounterCombat.currentCombatIndex).toBe(3);

    // player ainda tem estado válido aqui
    expect(player.combatState!.currentHp).toBeGreaterThan(0);
    expect(player.combatState!.isDead()).toBe(false);

    // log consolidado do encounter
    expect(encounterCombat.textLog.length).toBeGreaterThan(0);

    // 🧹 cleanup final do encounter
    const endResult = encounterCombat.end();
    expect(endResult.isSuccess()).toBe(true);
    expect(endResult.reason).toBe("ENCOUNTER_FINISHED");
  });

  test("players received rewards", () => {
    expect(player.gold.amount).toBe(3);
    expect(player.xp.amount).toBe(30);
  });
});
