// tests/game/systems/combat.integration.test.js
import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";
import actionSkills from "src/game/archetypes/skillsList/physical/action";
const skills = actionSkills;

describe("Combat - Integration Test", () => {
  test("should run combat until one character dies and return combat log", () => {
    // 🎲 RNG determinístico (nunca crita nem evade)
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
        dex: 5,
        int: 5,
        wis: 5,
        agi: 10,
        cha: 5,
      },
      skills,
    );

    const combat = new Combat(player, enemy, undefined, undefined, rng);

    // ▶️ Act
    const combatLog = combat.startCombat();

    // ✅ Assert — efeitos observáveis
    expect(player.isDead() || enemy.isDead()).toBe(true);
    expect(combatLog).toContain("foi morto em combate");
    expect(typeof combatLog).toBe("string");
    expect(combatLog.length).toBeGreaterThan(0);

    // 🧪 Garantia extra: RNG foi usado
    expect(rng.rollPercent).toHaveBeenCalled();
  });
});
