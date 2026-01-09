import Character from "src/game/entities/character";
import Combat from "src/game/systems/combat";

describe("Combat - Integration Test", () => {
  beforeEach(() => {
    jest
      .spyOn(Math, "random")
      .mockReturnValueOnce(0.9) // evade false
      .mockReturnValueOnce(0.9) // crit false
      .mockReturnValue(0.9); // resto
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("should run combat until one character dies and return combat log", () => {
    const player = new Character("Hero", {
      sta: 10,
      str: 5,
      con: 10,
      dex: 5,
      int: 5,
      wis: 5,
      agi: 5,
      cha: 5,
    });

    const enemy = new Character("Goblin", {
      sta: 5,
      str: 10,
      con: 5,
      dex: 5,
      int: 5,
      wis: 5,
      agi: 10,
      cha: 5,
    });

    const combat = new Combat(player, enemy);

    // ▶️ Act
    const combatLog = combat.startCombat();
    console.log(combatLog);

    // ✅ Assert — efeitos observáveis
    expect(player.isDead() || enemy.isDead()).toBe(true);
    expect(combatLog).toContain("foi morto em combate");
    expect(typeof combatLog).toBe("string");
    expect(combatLog.length).toBeGreaterThan(0);
  });
});
