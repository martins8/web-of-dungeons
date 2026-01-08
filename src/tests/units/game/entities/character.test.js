import Character from "src/game/entities/character";

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
describe("Character TESTS", () => {
  describe("Character NAME VALIDATION", () => {
    test("should create Character with valid name", () => {
      const character = new Character("Arthur", validAttributes);
      expect(character.name).toBe("Arthur");
    });

    test("should throw error if name is not a string", () => {
      expect(() => new Character(123, validAttributes)).toThrow();
      expect(() => new Character(null, validAttributes)).toThrow();
      expect(() => new Character(undefined, validAttributes)).toThrow();
    });

    test("should throw error if name is empty", () => {
      expect(() => new Character("", validAttributes)).toThrow();
      expect(() => new Character("   ", validAttributes)).toThrow();
    });

    test("should throw error if name contains numbers", () => {
      expect(() => new Character("Arthur1", validAttributes)).toThrow();
      expect(() => new Character("4rthur", validAttributes)).toThrow();
    });

    test("should throw error if name contains spaces", () => {
      expect(() => new Character("Arthur Lima", validAttributes)).toThrow();
      expect(() => new Character(" Arthur", validAttributes)).toThrow();
      expect(() => new Character("Arthur ", validAttributes)).toThrow();
    });
  });

  describe("Character INITIALIZATION", () => {
    test("should create attributes, stats and health", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.attributes).toBeDefined();
      expect(character.stats).toBeDefined();
      expect(character.health).toBeDefined();
    });

    test("health maxHp should match stats.maxHp", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.health.maxHp).toBe(character.stats.maxHp);
    });
  });
});
