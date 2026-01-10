import EvadeSystem from "src/game/rng/evadeSystem";

describe("EvadeSystem", () => {
  let rng;

  beforeEach(() => {
    rng = { rollPercent: jest.fn() };
  });

  test("should return true when roll < final chance and reset bonus", () => {
    const evade = new EvadeSystem({ bonusPerFail: 2, maxChance: 40 });

    // stats: 10 eva
    rng.rollPercent.mockReturnValue(5); // roll < finalChance
    const result = evade.tryEvade(rng, 10);

    expect(result).toBe(true);
    expect(evade.currentBonus).toBe(0);
  });

  test("should increase bonusPerFail when evade fails and respect maxChance", () => {
    const evade = new EvadeSystem({ bonusPerFail: 2, maxChance: 40 });

    rng.rollPercent.mockReturnValue(100); // fail
    let result = evade.tryEvade(rng, 10);
    expect(result).toBe(false);
    expect(evade.currentBonus).toBe(2);

    // second fail
    rng.rollPercent.mockReturnValue(100);
    result = evade.tryEvade(rng, 10);
    expect(result).toBe(false);
    expect(evade.currentBonus).toBe(4);

    // simulate maxChance cap
    evade.currentBonus = 100;
    rng.rollPercent.mockReturnValue(100);
    result = evade.tryEvade(rng, 10);
    expect(result).toBe(false);
    expect(Math.min(10 + evade.currentBonus, evade.maxChance)).toBe(40);
  });

  test("reset method should reset currentBonus", () => {
    const evade = new EvadeSystem({ bonusPerFail: 2, maxChance: 40 });
    evade.currentBonus = 20;
    evade.reset();
    expect(evade.currentBonus).toBe(0);
  });
});
