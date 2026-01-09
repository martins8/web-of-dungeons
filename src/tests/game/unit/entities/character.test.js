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

  describe("Character METHODS", () => {
    test("doPhysicalAtk should return physical damage based on stats.pDmg", () => {
      const character = new Character("Hero", validAttributes);
      const damage = character.doPhysicalAtk();
      expect(damage).toBe(character.stats.pDmg);
    });

    test("reducePhysicalAtk should return 30% of stats.pDef rounded down", () => {
      const character = new Character("Hero", validAttributes);
      const reduceValue = character.reducePhysicalAtk();
      expect(reduceValue).toBe(Math.floor(character.stats.pDef * 0.3));
    });

    test("takePhysicalAtk should reduce health considering physical defense", () => {
      const attacker = new Character("Hero", validAttributes);
      const defender = new Character("Enemy", validAttributes);
      const initialHp = defender.health.currentHp;
      const incomingDamage = attacker.doPhysicalAtk();
      defender.takePhysicalAtk(incomingDamage);
      expect(defender.health.currentHp).toBeLessThan(initialHp);
    });

    test("takePhysicalAtk should not deal negative damage", () => {
      const defender = new Character("Tank", validAttributes);
      const initialHp = defender.health.currentHp;
      // dano menor que a redução
      defender.takePhysicalAtk(1);
      expect(defender.health.currentHp).toBe(initialHp);
    });

    test("isDead should return false when character is alive", () => {
      const character = new Character("Hero", validAttributes);
      expect(character.isDead()).toBe(false);
    });

    test("isDead should return true when character health reaches zero", () => {
      const character = new Character("Hero", validAttributes);
      character.takePhysicalAtk(9999);
      expect(character.isDead()).toBe(true);
    });
  });
});
