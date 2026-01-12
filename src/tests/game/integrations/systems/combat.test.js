// tests/game/systems/combat.integration.test.js
import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";
import actionSkillsList from "src/game/archetypes/skillsList/physical/actionSkillsList";

const skills = actionSkillsList;

describe("Combat - Integration Test", () => {
  test("should run combat until one character dies and generate combat log", () => {
    // 🎲 RNG determinístico (nunca evade nem crita)
    const rng = {
      rollPercent: jest.fn().mockReturnValue(99),
    };

    const player = new Character(
      "Hero",
      {
        sta: 10,
        str: 5,
        con: 10,
        dex: 5,
        int: 5,
        wis: 5,
        agi: 5,
        cha: 5,
      },
      skills,
    );

    const enemy = new Character(
      "Goblin",
      {
        sta: 5,
        str: 10,
        con: 5,
        dex: 10,
        int: 5,
        wis: 5,
        agi: 10,
        cha: 5,
      },
      skills,
    );

    const combat = new Combat(player, enemy, { rng });

    // ▶️ Inicializa combate
    combat.start();

    // 🔁 Simula o loop de jogo
    let result;
    result = combat.performAction("skill_002"); // sempre a mesma skill
    result = combat.performAction("skill_001");
    console.log("🟢", result);

    // ✅ Assert
    console.log("🔴", combat.combatLog);
    expect(player.isDead() || enemy.isDead()).toBe(true);
    expect(combat.combatLog).toContain("foi morto em combate");
    expect(typeof combat.combatLog).toBe("string");
    expect(combat.combatLog.length).toBeGreaterThan(0);

    // 🧪 RNG realmente foi usado
    expect(rng.rollPercent).toHaveBeenCalled();
  });
});
