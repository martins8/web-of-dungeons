import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";

describe("STATS CALCULATOR", () => {
  test("should correctly calculate stats from base attributes", () => {
    const attributes = new Attributes({
      sta: 10,
      str: 10,
      con: 10,
      dex: 10,
      int: 10,
      wis: 10,
      agi: 10,
      cha: 10,
    });

    const stats = StatsCalculator.calculate(attributes);

    expect(stats.pDmg).toBe(30); // 10*2 + 10
    expect(stats.mDmg).toBe(30); // 10*2 + 10
    expect(stats.pDef).toBe(30); // 10*2 + 10
    expect(stats.mDef).toBe(35); // 10*2 + 10 + 5
    expect(stats.maxHp).toBe(45); // 20 + 20 + 5
    expect(stats.critC).toBe(15); // 10 + 5
    expect(stats.critD).toBe(55); // 50 + 5
    expect(stats.eva).toBe(25); // 10 + 15
    expect(stats.init).toBe(10);
    expect(stats.speed).toBe(10);
    expect(stats.luck).toBe(40);
    expect(stats.hPower).toBe(30);
  });

  test("should scale correctly when attributes increase", () => {
    const attributes = new Attributes({
      sta: 20,
      str: 15,
      con: 12,
      dex: 8,
      int: 18,
      wis: 14,
      agi: 10,
      cha: 5,
    });

    const stats = StatsCalculator.calculate(attributes);

    expect(stats.pDmg).toBe(15 * 2 + 8);
    expect(stats.mDmg).toBe(18 * 2 + 14);
    expect(stats.mDef).toBe(14 * 2 + 18 + 12 * 0.5);
    expect(stats.maxHp).toBe(20 + 20 * 2 + 12 * 0.5);
  });

  describe("BUFF TESTS", () => {
    test("STATS - should update stats when applyStatusBuff called", () => {
      const attributes = new Attributes({
        sta: 1,
        str: 1,
        con: 1,
        dex: 1,
        int: 1,
        wis: 1,
        agi: 1,
        cha: 1,
      });
      const stats = StatsCalculator.calculate(attributes);
      expect(stats.pDmg).toBe(3);
      expect(stats.mDmg).toBe(3);
      expect(stats.mDef).toBe(3);
      expect(stats.maxHp).toBe(22);

      const buff = { pDmg: 2, mDmg: 2, mDef: 2, maxHp: 5 };
      const statsWithBuff = StatsCalculator.applyStatsBuff(stats, buff);
      expect(statsWithBuff.pDmg).toBe(5);
      expect(statsWithBuff.mDmg).toBe(5);
      expect(statsWithBuff.mDef).toBe(5);
      expect(statsWithBuff.maxHp).toBe(27);
    });
    test("ATTRIBUTES - should update ATTRIBUTES when applyAttrBuff called", () => {
      const attributes = new Attributes({
        sta: 1,
        str: 1,
        con: 1,
        dex: 1,
        int: 1,
        wis: 1,
        agi: 1,
        cha: 1,
      });
      const stats = StatsCalculator.calculate(attributes);
      expect(stats.pDmg).toBe(3);
      expect(stats.mDmg).toBe(3);
      expect(stats.mDef).toBe(3);
      expect(stats.maxHp).toBe(22);

      const buff = { str: 1 };
      const statsWithBuff = StatsCalculator.applyAttrBuff(attributes, buff);
      expect(statsWithBuff.pDmg).toBe(5);
    });
  });
});
