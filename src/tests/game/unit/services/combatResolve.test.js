import CombatResolve from "src/game/services/combatResolve";
import CombatActionResult from "src/game/services/combatActionResult";

describe("CombatResolve TESTS", () => {
  test("should apply physical damage and return CombatActionResult", () => {
    const attacker = {
      stats: {
        pDmg: 20,
        critC: 0,
        critD: 0,
      },
    };

    const defender = {
      stats: {
        pDef: 0,
        eva: 0,
      },
      health: {
        currentHp: 50,
      },
      takeDamage: jest.fn(function (damage) {
        this.health.currentHp -= damage;
      }),
      isDead: jest.fn(function () {
        return this.health.currentHp <= 0;
      }),
    };

    const combatResolve = new CombatResolve();

    const result = combatResolve.physical(attacker, defender);

    expect(result).toBeInstanceOf(CombatActionResult);
    expect(result.damage).toBe(20);
    expect(result.isEvaded).toBe(false);
    expect(result.isCritical).toBe(false);
    expect(defender.takeDamage).toHaveBeenCalledWith(20);
  });

  test("should evade physical attack", () => {
    jest.spyOn(Math, "random").mockReturnValue(0); // garante evade

    const attacker = {
      stats: { pDmg: 20, critC: 0, critD: 0 },
    };

    const defender = {
      stats: { pDef: 10, eva: 100 },
      takeDamage: jest.fn(),
      isDead: jest.fn().mockReturnValue(false),
    };

    const combatResolve = new CombatResolve();
    const result = combatResolve.physical(attacker, defender);

    expect(result.isEvaded).toBe(true);
    expect(result.damage).toBe(0);
    expect(defender.takeDamage).not.toHaveBeenCalled();

    Math.random.mockRestore();
  });
});
