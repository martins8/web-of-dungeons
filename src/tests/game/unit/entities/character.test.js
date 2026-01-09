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

    test("should throw error if name is invalid", () => {
      expect(() => new Character(123, validAttributes)).toThrow();
      expect(() => new Character("", validAttributes)).toThrow();
      expect(() => new Character("Arthur Lima", validAttributes)).toThrow();
    });
  });

  describe("Character INITIALIZATION", () => {
    test("should initialize attributes, stats and health", () => {
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

  describe("Character STATE", () => {
    test("takeDamage should reduce health", () => {
      const character = new Character("Hero", validAttributes);
      const initialHp = character.health.currentHp;

      character.takeDamage(10);

      expect(character.health.currentHp).toBeLessThan(initialHp);
    });

    test("takeDamage should not reduce below zero", () => {
      const character = new Character("Hero", validAttributes);

      character.takeDamage(9999);

      expect(character.health.currentHp).toBe(0);
    });

    test("isDead should return false when alive", () => {
      const character = new Character("Hero", validAttributes);
      expect(character.isDead()).toBe(false);
    });

    test("isDead should return true when health is zero", () => {
      const character = new Character("Hero", validAttributes);

      character.takeDamage(9999);

      expect(character.isDead()).toBe(true);
    });
  });
});
