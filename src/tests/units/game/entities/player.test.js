import Player from "src/game/entities/player";

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
describe("PLAYER TESTS", () => {
  describe("PLAYER NAME VALIDATION", () => {
    test("should create player with valid name", () => {
      const player = new Player("Arthur", validAttributes);
      expect(player.name).toBe("Arthur");
    });

    test("should throw error if name is not a string", () => {
      expect(() => new Player(123, validAttributes)).toThrow();
      expect(() => new Player(null, validAttributes)).toThrow();
      expect(() => new Player(undefined, validAttributes)).toThrow();
    });

    test("should throw error if name is empty", () => {
      expect(() => new Player("", validAttributes)).toThrow();
      expect(() => new Player("   ", validAttributes)).toThrow();
    });

    test("should throw error if name contains numbers", () => {
      expect(() => new Player("Arthur1", validAttributes)).toThrow();
      expect(() => new Player("4rthur", validAttributes)).toThrow();
    });

    test("should throw error if name contains spaces", () => {
      expect(() => new Player("Arthur Lima", validAttributes)).toThrow();
      expect(() => new Player(" Arthur", validAttributes)).toThrow();
      expect(() => new Player("Arthur ", validAttributes)).toThrow();
    });
  });

  describe("PLAYER INITIALIZATION", () => {
    test("should create attributes, stats and health", () => {
      const player = new Player("Arthur", validAttributes);

      expect(player.attributes).toBeDefined();
      expect(player.stats).toBeDefined();
      expect(player.health).toBeDefined();
    });

    test("health maxHp should match stats.maxHp", () => {
      const player = new Player("Arthur", validAttributes);

      expect(player.health.maxHp).toBe(player.stats.maxHp);
    });
  });
});
