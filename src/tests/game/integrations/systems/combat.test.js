import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";

const attributes = [
  { sta: 4, str: 4, con: 20, dex: 4, int: 4, wis: 4, agi: 15, cha: 4 },
  { sta: 4, str: 4, con: 4, dex: 4, int: 4, wis: 4, agi: 4, cha: 4 },
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
