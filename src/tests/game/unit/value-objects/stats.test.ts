import Stats from "src/game/value-objects/stats";

describe("STATS", () => {
  test("should create stats object with provided values", () => {
    const stats = new Stats({
      pDmg: 30,
      mDmg: 30,
      pDef: 30,
      mDef: 35,
      critC: 15,
      critD: 55,
      eva: 25,
      luck: 40,
      init: 10,
      speed: 10,
      maxHp: 45,
      hPower: 30,
    });

    expect(stats.pDmg).toBe(30);
    expect(stats.mDef).toBe(35);
    expect(stats.maxHp).toBe(45);
    expect(stats.hPower).toBe(30);
  });

  test("stats should expose all combat-related properties", () => {
    const stats = new Stats({
      pDmg: 1,
      mDmg: 1,
      pDef: 1,
      mDef: 1,
      critC: 1,
      critD: 1,
      eva: 1,
      luck: 1,
      init: 1,
      speed: 1,
      maxHp: 1,
      hPower: 1,
    });

    [
      "pDmg",
      "mDmg",
      "pDef",
      "mDef",
      "critC",
      "critD",
      "eva",
      "luck",
      "init",
      "speed",
      "maxHp",
      "hPower",
    ].forEach((key) => {
      expect(stats).toHaveProperty(key);
    });
  });
});
