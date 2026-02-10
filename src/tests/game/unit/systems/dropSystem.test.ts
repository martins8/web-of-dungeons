import DropSystem, { type DropEntry } from "src/game/systems/dropSystem";
import SeedRNG from "src/game/rng/seedRNG";

describe("DropSystem", () => {
  describe("calculateDrops", () => {
    test("returns empty result for null drops", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      const result = dropSystem.calculateDrops(null);

      expect(result.items).toHaveLength(0);
      expect(result.droppedIds).toHaveLength(0);
    });

    test("returns empty result for empty drops array", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      const result = dropSystem.calculateDrops([]);

      expect(result.items).toHaveLength(0);
      expect(result.droppedIds).toHaveLength(0);
    });

    test("drops item with 100% weight", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      const drops: DropEntry[] = [{ itemId: "starter_sword", weight: 100 }];

      const result = dropSystem.calculateDrops(drops);

      expect(result.items).toHaveLength(1);
      expect(result.droppedIds).toContain("starter_sword");
    });

    test("does not drop item with 0% weight", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      const drops: DropEntry[] = [{ itemId: "starter_sword", weight: 0 }];

      const result = dropSystem.calculateDrops(drops);

      expect(result.items).toHaveLength(0);
      expect(result.droppedIds).toHaveLength(0);
    });

    test("multiple items drop independently", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      const drops: DropEntry[] = [
        { itemId: "starter_sword", weight: 100 },
        { itemId: "starter_staff", weight: 100 },
        { itemId: "starter_shield", weight: 100 },
      ];

      const result = dropSystem.calculateDrops(drops);

      expect(result.items).toHaveLength(3);
      expect(result.droppedIds).toContain("starter_sword");
      expect(result.droppedIds).toContain("starter_staff");
      expect(result.droppedIds).toContain("starter_shield");
    });

    test("skips invalid item ids without crashing", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);
      const consoleSpy = jest.spyOn(console, "warn").mockImplementation();

      const drops: DropEntry[] = [
        { itemId: "invalid_item", weight: 100 },
        { itemId: "starter_sword", weight: 100 },
      ];

      const result = dropSystem.calculateDrops(drops);

      expect(result.items).toHaveLength(1);
      expect(result.droppedIds).toContain("starter_sword");
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });

    test("deterministic drops with same seed", () => {
      const drops: DropEntry[] = [
        { itemId: "starter_sword", weight: 50 },
        { itemId: "starter_staff", weight: 50 },
      ];

      const rng1 = new SeedRNG(99999);
      const dropSystem1 = new DropSystem(rng1);
      const result1 = dropSystem1.calculateDrops(drops);

      const rng2 = new SeedRNG(99999);
      const dropSystem2 = new DropSystem(rng2);
      const result2 = dropSystem2.calculateDrops(drops);

      expect(result1.droppedIds).toEqual(result2.droppedIds);
    });
  });

  describe("rollDrop", () => {
    test("returns true for 100 weight", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      expect(dropSystem.rollDrop(100)).toBe(true);
    });

    test("returns false for 0 weight", () => {
      const rng = new SeedRNG(12345);
      const dropSystem = new DropSystem(rng);

      expect(dropSystem.rollDrop(0)).toBe(false);
    });
  });
});
