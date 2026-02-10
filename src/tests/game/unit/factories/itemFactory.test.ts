import ItemFactory from "src/game/factories/itemFactory";
import Item from "src/game/value-objects/item";

describe("ItemFactory", () => {
  test("creates an item from valid id", () => {
    const item = ItemFactory.fromItemId("starter_sword");

    expect(item).toBeInstanceOf(Item);
    expect(item.id).toBe("starter_sword");
    expect(item.metadata.name).toBeDefined();
  });

  test("creates equipment item with correct properties", () => {
    const item = ItemFactory.fromItemId("starter_sword");

    expect(item.type).toBe("equipment");
    expect(item.equipmentItem).toBeDefined();
    expect(item.equipmentItem?.slot).toBe("mainhand");
    expect(item.equipmentItem?.weaponType).toBe("sword");
  });

  test("creates material item with correct properties", () => {
    const item = ItemFactory.fromItemId("wolf_pelt");

    expect(item).toBeInstanceOf(Item);
    expect(item.id).toBe("wolf_pelt");
    expect(item.type).toBe("material");
    expect(item.equipmentItem).toBeNull();
  });

  test("creates consumable item with correct properties", () => {
    const item = ItemFactory.fromItemId("health_potion");

    expect(item).toBeInstanceOf(Item);
    expect(item.id).toBe("health_potion");
    expect(item.type).toBe("consumable");
    expect(item.effects!.heal).toBe(50);
  });

  test("throws error for invalid item id", () => {
    expect(() => {
      ItemFactory.fromItemId("invalid_item_id");
    }).toThrow("Item with id 'invalid_item_id' not found in any registry");
  });

  test("exists returns true for valid item id", () => {
    expect(ItemFactory.exists("starter_sword")).toBe(true);
  });

  test("exists returns false for invalid item id", () => {
    expect(ItemFactory.exists("invalid_item_id")).toBe(false);
  });

  test("getDefinition returns item definition for valid id", () => {
    const def = ItemFactory.getDefinition("starter_sword");

    expect(def).not.toBeNull();
    expect(def?.id).toBe("starter_sword");
    expect(def?.type).toBe("equipment");
  });

  test("getDefinition returns null for invalid id", () => {
    const def = ItemFactory.getDefinition("invalid_item_id");

    expect(def).toBeNull();
  });
});
