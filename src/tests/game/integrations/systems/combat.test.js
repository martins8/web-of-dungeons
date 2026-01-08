import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";

const attributes = [
  { sta: 10, str: 5, con: 10, dex: 5, int: 5, wis: 5, agi: 5, cha: 5 },
  { sta: 5, str: 10, con: 7, dex: 5, int: 5, wis: 5, agi: 10, cha: 5 },
];

describe("Combat - Integration Test", () => {
  test("should run combat until one character dies and generate combat log", () => {
    const player = new Character("Hero", attributes[0]);
    const enemy = new Character("Goblin", attributes[1]);

    const combat = new Combat(player, enemy);

    // ▶️ Act
    combat.startCombat();

    // ✅ Assert (comportamento, não implementação)
    expect(player.isDead() || enemy.isDead()).toBe(true);
    expect(combat.combatLog.length).toBeGreaterThan(0);
    console.log(combat.combatLog);
  });
});
