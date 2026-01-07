import Enemy from "src/game/entities/enemy";
const validAttributes = {
  sta: 10,
  str: 10,
  con: 10,
  dex: 10,
  int: 10,
  wis: 10,
  agi: 10,
  cha: 10,
};

describe("ENEMY TESTS", () => {
  describe("ENEMY NAME VALIDATION", () => {
    test("should create player with valid name", () => {
      const enemy = new Enemy("Arthur", validAttributes);
      expect(enemy.name).toBe("Arthur");
    });

    test("should throw error if name is not a string", () => {
      expect(() => new Enemy(123, validAttributes)).toThrow();
      expect(() => new Enemy(null, validAttributes)).toThrow();
      expect(() => new Enemy(undefined, validAttributes)).toThrow();
    });

    test("should throw error if name is empty", () => {
      expect(() => new Enemy("", validAttributes)).toThrow();
      expect(() => new Enemy("   ", validAttributes)).toThrow();
    });

    test("should throw error if name contains numbers", () => {
      expect(() => new Enemy("Arthur1", validAttributes)).toThrow();
      expect(() => new Enemy("4rthur", validAttributes)).toThrow();
    });

    test("should throw error if name contains spaces", () => {
      expect(() => new Enemy("Arthur Lima", validAttributes)).toThrow();
      expect(() => new Enemy(" Arthur", validAttributes)).toThrow();
      expect(() => new Enemy("Arthur ", validAttributes)).toThrow();
    });
  });

  describe("ENEMY INITIALIZATION", () => {
    test("should create attributes, stats and health", () => {
      const enemy = new Enemy("Arthur", validAttributes);

      expect(enemy.attributes).toBeDefined();
      expect(enemy.stats).toBeDefined();
      expect(enemy.health).toBeDefined();
    });

    test("health maxHp should match stats.maxHp", () => {
      const enemy = new Enemy("Arthur", validAttributes);

      expect(enemy.health.maxHp).toBe(enemy.stats.maxHp);
    });
  });
});
