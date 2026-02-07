import Inventory from "src/game/gcomponents/inventory";
import { Items } from "src/game/gcomponents/inventory";
describe("Inventory TESTS", () => {
  test("should initialize inventory with default values", () => {
    const inventory = new Inventory();
    expect(inventory.slots).toBe(20);
    expect(inventory.items).toEqual([]);
  });

  test("should add items to inventory", () => {
    const inventory = new Inventory(5);
    const item: Items = {
      id: "potion1",
      type: "consumable",
      metadata: { name: "Health Potion", description: "Restores 50 HP" },
    };
    inventory.addItem([item]);
    expect(inventory.items).toContain(item);
  });

  test("should remove items from inventory", () => {
    const inventory = new Inventory(5);
    const item: Items = {
      id: "potion1",
      type: "consumable",
      metadata: { name: "Health Potion", description: "Restores 50 HP" },
    };
    inventory.addItem([item]);
    inventory.removeItem("potion1");
    expect(inventory.items).not.toContain(item);
  });

  test("should get item by ID", () => {
    const inventory = new Inventory(5);
    const item: Items = {
      id: "potion1",
      type: "consumable",
      metadata: { name: "Health Potion", description: "Restores 50 HP" },
    };
    inventory.addItem([item]);
    const retrievedItem = inventory.getItemById("potion1");
    expect(retrievedItem).toEqual(item);
  });

  test("should return null for non-existent item ID", () => {
    const inventory = new Inventory(5);
    const retrievedItem = inventory.getItemById("nonexistent");
    expect(retrievedItem).toBeNull();
  });

  test("should not add items if not enough slots", () => {
    const inventory = new Inventory(2);
    const items: Items[] = [
      {
        id: "item1",
        type: "consumable",
        metadata: { name: "Item 1", description: "Description 1" },
      },
      {
        id: "item2",
        type: "consumable",
        metadata: { name: "Item 2", description: "Description 2" },
      },
      {
        id: "item3",
        type: "consumable",
        metadata: { name: "Item 3", description: "Description 3" },
      },
    ];
    expect(() => inventory.addItem(items)).toThrow(
      "Not enough slots. Available: 2",
    );
  });

  test("should not remove non-existent item", () => {
    const inventory = new Inventory(5);
    expect(() => inventory.removeItem("nonexistent")).toThrow(
      "Item not found in inventory.",
    );
  });
});
