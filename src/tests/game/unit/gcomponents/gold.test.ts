import Gold from "src/game/gcomponents/gold";

describe("Gold TEST", () => {
  test("Gold should be initialized with the corret amount ", () => {
    const gold = new Gold(100);
    expect(gold.amount).toBe(100);
  });

  test("Gold should be able to add amount", () => {
    const gold = new Gold(100);
    gold.add(50);
    expect(gold.amount).toBe(150);
  });

  test("Gold should be able to subtract amount", () => {
    const gold = new Gold(100);
    gold.spend(30);
    expect(gold.amount).toBe(70);
  });
});
