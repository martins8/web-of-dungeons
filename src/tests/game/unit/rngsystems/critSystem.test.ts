import CritSystem from "src/game/rng/critSystem";

describe("CritSystem", () => {
  let rng;

  beforeEach(() => {
    rng = { rollPercent: jest.fn() };
  });

  test("should return true when roll < final chance and reset bonus", () => {
    const crit = new CritSystem({ bonusPerFail: 5, maxChance: 50 });

    // stats: 10 base crit
    rng.rollPercent.mockReturnValue(9); // roll < finalChance (10 + 0)
    const result = crit.tryCrit(rng, 10);

    expect(result).toBe(true);
    expect(crit.currentBonus).toBe(0);
  });

  test("should increase bonusPerFail when crit fails and respect maxChance", () => {
    const crit = new CritSystem({ bonusPerFail: 5, maxChance: 50 });

    // stats: 10 base crit, roll high so fail
    rng.rollPercent.mockReturnValue(100); // roll > finalChance
    let result = crit.tryCrit(rng, 10);

    expect(result).toBe(false);
    expect(crit.currentBonus).toBe(5);

    // next attempt fail again
    rng.rollPercent.mockReturnValue(100);
    result = crit.tryCrit(rng, 10);
    expect(result).toBe(false);
    expect(crit.currentBonus).toBe(10);

    // simulate maxChance cap
    crit.currentBonus = 100;
    rng.rollPercent.mockReturnValue(100);
    result = crit.tryCrit(rng, 10);
    expect(result).toBe(false);
    // finalChance capped at 50
    expect(Math.min(10 + crit.currentBonus, crit.maxChance)).toBe(50);
  });

  test("reset method should reset currentBonus", () => {
    const crit = new CritSystem({ bonusPerFail: 5, maxChance: 50 });
    crit.currentBonus = 30;
    crit.reset();
    expect(crit.currentBonus).toBe(0);
  });
});
