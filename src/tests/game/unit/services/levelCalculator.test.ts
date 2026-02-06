import LevelCalculator from "src/game/services/levelCalculator";

describe("Level Calculator unit test", () => {
  test("calculates level based on cumulative progressive XP", () => {
    expect(LevelCalculator.fromXP(99)).toBe(1);
    expect(LevelCalculator.fromXP(100)).toBe(2);
    expect(LevelCalculator.fromXP(250)).toBe(3);
    expect(LevelCalculator.fromXP(450)).toBe(4);
    expect(LevelCalculator.fromXP(0)).toBe(1);
    expect(LevelCalculator.fromXP(-50)).toBe(1);
    expect(LevelCalculator.fromXP(5000)).toBeGreaterThan(5);
  });
});
