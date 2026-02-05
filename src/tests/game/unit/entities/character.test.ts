import Character from "src/game/entities/character";
import CombatState from "src/game/gcomponents/combatState";

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

describe("Character", () => {
  describe("Initialization", () => {
    test("should create character with name, attributes, stats and health", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.name).toBe("Arthur");
      expect(character.attributes).toBeDefined();
      expect(character.stats).toBeDefined();
      expect(character.health).toBeDefined();
    });

    test("health maxHp should match stats.maxHp", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.health.maxHp).toBe(character.stats.maxHp);
    });

    test("should initialize crit and evade systems", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.critSystem).toBeDefined();
      expect(character.evadeSystem).toBeDefined();
    });

    test("should initialize skills array", () => {
      const skills = [{ id: "slash" }];
      const character = new Character("Arthur", validAttributes, skills);

      expect(character.skills).toBe(skills);
    });

    test("should initialize turn system", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.turnSystem).toBeDefined();
    });

    test("combatState should start as null", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.combatState).toBeNull();
    });
  });

  describe("Name validation", () => {
    test("should throw error for invalid names", () => {
      expect(() => new Character(123, validAttributes)).toThrow();
      expect(() => new Character("", validAttributes)).toThrow();
      expect(() => new Character("Arthur 1", validAttributes)).toThrow();
    });
  });

  describe("Combat State lifecycle", () => {
    test("initCombatState should create a CombatState instance", () => {
      const character = new Character("Arthur", validAttributes);

      character.initCombatState();

      expect(character.combatState).toBeInstanceOf(CombatState);
    });

    test("finishCombatState should clear combatState", () => {
      const character = new Character("Arthur", validAttributes);

      character.initCombatState();
      character.finishCombatState();

      expect(character.combatState).toBeNull();
    });
  });

  describe("Combat-related behavior", () => {
    test("isDead should return false when not in combat", () => {
      const character = new Character("Arthur", validAttributes);

      expect(character.isDead()).toBe(false);
    });

    test("isDead should reflect combatState.isDead when in combat", () => {
      const character = new Character("Arthur", validAttributes);

      character.initCombatState();
      character.combatState.takeDamage(9999);

      expect(character.isDead()).toBe(true);
    });
  });

  describe("Skills", () => {
    test("getSkillById should return correct skill", () => {
      const skills = [
        { id: "slash", name: "Slash" },
        { id: "fireball", name: "Fireball" },
      ];

      const character = new Character("Mage", validAttributes, skills);

      const skill = character.getSkillById("fireball");

      expect(skill).toEqual({ id: "fireball", name: "Fireball" });
    });

    test("getSkillById should return undefined if skill does not exist", () => {
      const character = new Character("Arthur", validAttributes, []);

      expect(() => character.getSkillById("unknown")).toThrow();
    });
  });
});
