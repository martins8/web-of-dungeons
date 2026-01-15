import EffectSystem from "src/game/systems/effectSystem";

describe("EFFECTSYSTEM TESTS", () => {
  test("should apply DOT damage on tick", () => {
    const effect = {
      effectType: "dot",
      scaling: { pDmg: 1 },
      duration: 2,
    };

    const combatState = {
      getEffectiveStats: () => ({ pDmg: 10 }),
      takeDamage: jest.fn(),
      heal: jest.fn(),
    };

    const system = new EffectSystem(effect);
    system.tick(combatState);

    expect(combatState.takeDamage).toHaveBeenCalledWith(10);
    expect(combatState.heal).not.toHaveBeenCalled();
  });

  test("should apply HOT heal on tick", () => {
    const effect = {
      effectType: "hot",
      scaling: { hPower: 2 },
      duration: 2,
    };

    const combatState = {
      getEffectiveStats: () => ({ hPower: 5 }),
      takeDamage: jest.fn(),
      heal: jest.fn(),
    };

    const system = new EffectSystem(effect);
    system.tick(combatState);

    expect(combatState.heal).toHaveBeenCalledWith(10);
    expect(combatState.takeDamage).not.toHaveBeenCalled();
  });

  test("should apply CC correctly", () => {
    const effect = {
      effectType: "cc",
      subtype: "stunned",
      duration: 1,
    };

    const combatState = {
      addBuff: jest.fn(),
      addDebuff: jest.fn(),
      applyCC: jest.fn(),
    };

    const system = new EffectSystem(effect);
    system.apply(combatState);

    expect(combatState.applyCC).toHaveBeenCalledWith("stunned");
  });
});
