import EffectSystem from "src/game/systems/effectSystem";

describe("EffectSystem TESTS", () => {
  test("should return DOT damage value on tick", () => {
    const effect = {
      effectType: "dot",
      scaling: { pDmg: 1 },
      duration: 2,
    };

    const combatState = {
      getEffectiveStats: () => ({ pDmg: 10 }),
    };

    const system = new EffectSystem(effect);
    const damage = system.tick(combatState);

    expect(damage).toBe(10);
  });
  test("should return HOT heal value on tick", () => {
    const effect = {
      effectType: "hot",
      scaling: { hPower: 2 },
      duration: 2,
    };

    const combatState = {
      getEffectiveStats: () => ({ hPower: 5 }),
    };

    const system = new EffectSystem(effect);
    const heal = system.tick(combatState);

    expect(heal).toBe(10);
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
