import Character from "src/game/entities/character";
import actionSkillsList from "src/game/archetypes/skillsList/physical/actionSkillsList";

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

const validSkills = actionSkillsList;

describe("Character", () => {
  describe("NAME VALIDATION", () => {
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

  describe("INITIALIZATION", () => {
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

    test("should initialize crit and evade systems", () => {
      const character = new Character("Hero", validAttributes);

      expect(character.critSystem).toBeDefined();
      expect(character.evadeSystem).toBeDefined();
    });

    test("should initialize TurnSystem", () => {
      const character = new Character("Hero", validAttributes);

      expect(character.turnSystem).toBeDefined();
      expect(character.turnSystem.actionsOnTurn).toBe(2);
    });

    test("should initialize with skills", () => {
      const character = new Character("Hero", validAttributes, validSkills);

      expect(character.skills).toBeDefined();
      expect(Array.isArray(character.skills)).toBe(true);
      expect(character.skills.length).toBeGreaterThan(0);
    });
  });

  describe("STATE", () => {
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

  describe("RNG SYSTEMS", () => {
    test("crit and evade systems should start with zero bonus", () => {
      const character = new Character("Hero", validAttributes);

      expect(character.critSystem.currentBonus).toBe(0);
      expect(character.evadeSystem.currentBonus).toBe(0);
    });

    test("crit and evade systems reset should clear bonus", () => {
      const character = new Character("Hero", validAttributes);

      character.critSystem.currentBonus = 10;
      character.evadeSystem.currentBonus = 10;

      character.critSystem.reset();
      character.evadeSystem.reset();

      expect(character.critSystem.currentBonus).toBe(0);
      expect(character.evadeSystem.currentBonus).toBe(0);
    });
  });

  describe("SKILLS", () => {
    test("getSkillById should return correct skill", () => {
      const character = new Character("Hero", validAttributes, validSkills);

      const skill = character.getSkillById(2);

      expect(skill).toBeDefined();
      expect(skill.name).toBe("Sword Strike");
    });

    test("getSkillById should return undefined for invalid id", () => {
      const character = new Character("Hero", validAttributes, validSkills);

      const skill = character.getSkillById(999);

      expect(skill).toBeUndefined();
    });
  });

  describe("TURN SYSTEM INTEGRATION", () => {
    test("startTurn should reset character turn actions", () => {
      const character = new Character("Hero", validAttributes, validSkills);

      character.turnSystem.actionsOnTurn = 0;
      character.startTurn();

      expect(character.turnSystem.actionsOnTurn).toBe(2);
    });

    test("endTurn should increment turn count", () => {
      const character = new Character("Hero", validAttributes);

      character.endTurn();

      expect(character.turnSystem.turnCount).toBe(1);
    });
  });
});
