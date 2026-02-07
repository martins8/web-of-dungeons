import Item from "src/game/value-objects/item";
describe("Item", () => {
  test("should create an item with correct properties", () => {
    const item: Item = {
      id: "item1",
      type: "consumable",
      metadata: {
        name: "Health Potion",
        description: "Restores 50 HP.",
      },
      equipmentItem: null,
    };

    expect(item.id).toBe("item1");
    expect(item.type).toBe("consumable");
    expect((item.metadata as any).name).toBe("Health Potion");
    expect((item.metadata as any).description).toBe("Restores 50 HP.");
  });

  test("should allow additional metadata properties", () => {
    const item: Item = {
      id: "item2",
      type: "equipment",
      metadata: {
        name: "Iron Sword",
        description: "A basic sword made of iron.",
        rarity: "common",
        damage: 10,
      } as any,
      equipmentItem: null,
    };

    expect((item.metadata as any).rarity).toBe("common");
    expect((item.metadata as any).damage).toBe(10);
  });
});
