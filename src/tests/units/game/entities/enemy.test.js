import Enemy from "src/game/entities/enemy";

describe("ENEMY TESTS", () => {
  describe("ENEMY NAME VALIDATION", () => {
    test("should create player with valid name", () => {
      const enemy = new Enemy("Arthur");
      expect(enemy.name).toBe("Arthur");
    });

    test("should throw error if name is not a string", () => {
      expect(() => new Enemy(123)).toThrow();
      expect(() => new Enemy(null)).toThrow();
      expect(() => new Enemy(undefined)).toThrow();
    });

    test("should throw error if name is empty", () => {
      expect(() => new Enemy("")).toThrow();
      expect(() => new Enemy("   ")).toThrow();
    });

    test("should throw error if name contains numbers", () => {
      expect(() => new Enemy("Arthur1")).toThrow();
      expect(() => new Enemy("4rthur")).toThrow();
    });

    test("should throw error if name contains spaces", () => {
      expect(() => new Enemy("Arthur Lima")).toThrow();
      expect(() => new Enemy(" Arthur")).toThrow();
      expect(() => new Enemy("Arthur ")).toThrow();
    });
  });
});
