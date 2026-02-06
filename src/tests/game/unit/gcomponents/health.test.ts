import Health from "src/game/gcomponents/health";

describe("HEALTH TESTS", () => {
  test("hp never goes below zero", () => {
    const health = new Health(50);
    health.takeDamage(999);
    expect(health.currentHp).toBe(0);
  });
  test("hp never exceeds max hp", () => {
    const health = new Health(50);
    health.takeDamage(20);
    health.heal(30);
    expect(health.currentHp).toBe(50);
  });

  test("increase hp need to change max hp", () => {
    const health = new Health(50);
    health.increaseMaxHp(5);
    expect(health.maxHp).toBe(55);
  });

  test("player needs to die if currentHp < 0", () => {
    const health = new Health(50);
    health.takeDamage(55);
    expect(health.isAlive()).toBe(false);
  });
});
