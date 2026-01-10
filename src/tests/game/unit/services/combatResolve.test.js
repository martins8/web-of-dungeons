// tests/game/services/combatResolve.test.js
import CombatResolve from "src/game/services/combatResolve";
import CombatActionResult from "src/game/services/combatActionResult";

describe("CombatResolve TESTS", () => {
  test("should apply physical damage", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(99) };

    const attacker = {
      stats: { pDmg: 20, critC: 0, critD: 50 },
      critSystem: { tryCrit: jest.fn().mockReturnValue(false) },
    };

    const defender = {
      stats: { pDef: 0, eva: 0 },
      evadeSystem: { tryEvade: jest.fn().mockReturnValue(false) },
      health: { currentHp: 50 },
      takeDamage: jest.fn(function (dmg) {
        this.health.currentHp -= dmg;
      }),
      isDead: jest.fn(function () {
        return this.health.currentHp <= 0;
      }),
    };

    const combatResolve = new CombatResolve();
    const result = combatResolve.physical(attacker, defender, {
      rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(20);
    expect(result.isCritical).toBe(false);
    expect(result.isEvaded).toBe(false);
  });

  test("should evade attack", () => {
    const rng = { rollPercent: jest.fn().mockReturnValue(0) };

    const attacker = {
      stats: { pDmg: 20, critC: 0, critD: 0 },
      critSystem: { tryCrit: jest.fn() },
    };

    const defender = {
      stats: { pDef: 10, eva: 100 },
      evadeSystem: { tryEvade: jest.fn().mockReturnValue(true) },
      takeDamage: jest.fn(),
      isDead: jest.fn().mockReturnValue(false),
    };

    const combatResolve = new CombatResolve();
    const result = combatResolve.physical(attacker, defender, {
      rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    expect(result.isEvaded).toBe(true);
    expect(result.damage).toBe(0);
    expect(defender.takeDamage).not.toHaveBeenCalled();
  });
});
