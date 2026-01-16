import CombatResolve from "src/game/services/combatResolve";
import CombatActionResult from "src/game/value-objects/combatActionResult";

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
    const critSystem = { tryCrit: jest.fn().mockReturnValue(false) };
    const evadeSystem = { tryEvade: jest.fn().mockReturnValue(false) };

    const attacker = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDmg: 20,
          maestry: 5,
          critC: 0,
          critD: 50,
        }),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const defender = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDef: 0,
          eva: 0,
        }),
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(
      attacker,
      defender,
      skills[0],
      false, // ticked
      { rng, critSystem, evadeSystem },
    );

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(30); // 20*1 + 5*2
    expect(result.isCritical).toBe(false);
    expect(result.isEvaded).toBe(false);
    expect(defender.combatState.takeDamage).toHaveBeenCalledWith(30);
  });

  test("should apply magical damage", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(99) };
    const critSystem = { tryCrit: jest.fn().mockReturnValue(false) };
    const evadeSystem = { tryEvade: jest.fn().mockReturnValue(false) };

    const attacker = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          mDmg: 25,
          critC: 0,
          critD: 50,
        }),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const defender = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          mDef: 0,
          eva: 0,
        }),
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(attacker, defender, skills[1], false, {
      rng,
      critSystem,
      evadeSystem,
    });

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(25);
    expect(result.isCritical).toBe(false);
    expect(result.isEvaded).toBe(false);
    expect(defender.combatState.takeDamage).toHaveBeenCalledWith(25);
  });

  test("should evade attack", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(0) };
    const critSystem = { tryCrit: jest.fn() };
    const evadeSystem = { tryEvade: jest.fn().mockReturnValue(true) };

    const attacker = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDmg: 20,
          critC: 0,
          critD: 0,
        }),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const defender = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDef: 10,
          eva: 100,
        }),
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 0, heal: 0 }),
      },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(attacker, defender, skills[0], false, {
      rng,
      critSystem,
      evadeSystem,
    });

    expect(result.isEvaded).toBe(true);
    expect(result.damage).toBe(0);
    expect(defender.combatState.takeDamage).not.toHaveBeenCalled();
  });
  test("should apply DoT and HoT when ticked is true", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(99) };
    const critSystem = { tryCrit: jest.fn().mockReturnValue(false) };
    const evadeSystem = { tryEvade: jest.fn().mockReturnValue(false) };

    const attacker = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDmg: 10,
          critC: 0,
          critD: 0,
        }),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 3, heal: 5 }), // HOT + DOT no atacante
      },
    };

    const defender = {
      combatState: {
        getEffectiveStats: jest.fn().mockReturnValue({
          pDef: 0,
          eva: 0,
        }),
        takeDamage: jest.fn(),
        isDead: jest.fn().mockReturnValue(false),
        tickEffectsDamageAndHeal: jest
          .fn()
          .mockReturnValue({ damage: 7, heal: 0 }), // DOT no defensor
      },
    };

    const skill = {
      id: "skill_dot_hot",
      rank: 1,
      typeSkill: "action",
      cooldown: 0,
      damage: {
        typeDamage: "physical",
        scaling: { pDmg: 1 },
      },
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.action(
      attacker,
      defender,
      skill,
      true, // 🔥 ticked ON
      { rng, critSystem, evadeSystem },
    );

    expect(result).toBeInstanceOf(CombatActionResult);

    // dano direto da skill
    expect(result.damage).toBe(10);

    // DOT / HOT corretamente propagados
    expect(result.dot.onAttacker).toBe(3);
    expect(result.hot.onAttacker).toBe(5);

    expect(result.dot.onDefender).toBe(7);
    expect(result.hot.onDefender).toBe(0);

    // dano direto ainda aplicado
    expect(defender.combatState.takeDamage).toHaveBeenCalledWith(10);
  });
});
