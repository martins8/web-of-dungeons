import CombatResolve from "src/game/services/combatResolve";
import CombatActionResult from "src/game/services/combatActionResult";

const skills = [
  {
    id: "skill_001",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 0,
    damage: {
      typeDamage: "physical",
      scaling: {
        pDmg: 1,
        maestry: 2,
      },
    },
    metadata: {
      name: "Basic Attack",
      text: "a basic attack",
      rarity: "common",
    },
  },
  {
    id: "skill_002",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 2,
    damage: {
      typeDamage: "magical",
      scaling: {
        mDmg: 1,
      },
    },
    metadata: {
      name: "Sword Strike",
      text: "Dieee!!!",
      rarity: "common",
    },
  },
];

describe("CombatResolve TESTS", () => {
  test("should apply physical damage", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(99) };

    const attacker = {
      critSystem: { tryCrit: jest.fn().mockReturnValue(false) },
      combatState: {
        stats: { pDmg: 20, maestry: 5, critC: 0, critD: 50 },
      },
    };

    const defender = {
      combatState: {
        stats: { pDef: 0, eva: 0 },
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
      },
      evadeSystem: { tryEvade: jest.fn().mockReturnValue(false) },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(attacker, defender, skills[0], {
      rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(30);
    expect(result.isCritical).toBe(false);
    expect(result.isEvaded).toBe(false);
    expect(defender.combatState.takeDamage).toHaveBeenCalledWith(30);
  });

  test("should apply magical damage", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(99) };

    const attacker = {
      critSystem: { tryCrit: jest.fn().mockReturnValue(false) },
      combatState: {
        stats: { mDmg: 25, critC: 0, critD: 50 },
      },
    };

    const defender = {
      combatState: {
        stats: { mDef: 0, eva: 0 },
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
      },
      evadeSystem: { tryEvade: jest.fn().mockReturnValue(false) },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(attacker, defender, skills[1], {
      rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(25);
    expect(result.isCritical).toBe(false);
    expect(result.isEvaded).toBe(false);
    expect(defender.combatState.takeDamage).toHaveBeenCalledWith(25);
  });

  test("should evade attack", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(0) };

    const attacker = {
      critSystem: { tryCrit: jest.fn() },
      combatState: {
        stats: { pDmg: 20, critC: 0, critD: 0 },
      },
    };

    const defender = {
      combatState: {
        stats: { pDef: 10, eva: 100 },
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
      },
      evadeSystem: { tryEvade: jest.fn().mockReturnValue(true) },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(attacker, defender, skills[0], {
      rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    expect(result.isEvaded).toBe(true);
    expect(result.damage).toBe(0);
    expect(defender.combatState.takeDamage).not.toHaveBeenCalled();
  });
});
