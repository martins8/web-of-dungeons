import Player from "src/game/entities/player";

describe("PLAYER TESTS", () => {
  describe("PLAYER NAME VALIDATION", () => {
    test("should create player with valid name", () => {
      const player = new Player("Arthur");
      expect(player.name).toBe("Arthur");
    });

    test("should throw error if name is not a string", () => {
      expect(() => new Player(123)).toThrow();
      expect(() => new Player(null)).toThrow();
      expect(() => new Player(undefined)).toThrow();
    });

    test("should throw error if name is empty", () => {
      expect(() => new Player("")).toThrow();
      expect(() => new Player("   ")).toThrow();
    });

    test("should throw error if name contains numbers", () => {
      expect(() => new Player("Arthur1")).toThrow();
      expect(() => new Player("4rthur")).toThrow();
    });

    test("should throw error if name contains spaces", () => {
      expect(() => new Player("Arthur Lima")).toThrow();
      expect(() => new Player(" Arthur")).toThrow();
      expect(() => new Player("Arthur ")).toThrow();
    });
  });
});
