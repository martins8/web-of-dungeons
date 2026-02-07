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
      const skills: any = [{ id: "slash" }];
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
      // @ts-expect-error - test invalid input in runtime
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
      character.combatState!.takeDamage(9999);

      expect(character.isDead()).toBe(true);
    });
  });

  describe("Skills", () => {
    test("getSkillById should return correct skill", () => {
      const skills: any = [
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

  describe("character needs to be able to increase attributes with points", () => {
    test("should increase attribute and decrease attrPoints", () => {
      const character = new Character("Arthur", validAttributes, []);
      character.attrPoints = 5;
      character.increaseAttr("str", 3);
      expect(character.attributes.str).toBe(13);
      expect(character.attrPoints).toBe(2);
    });

    test("should throw error if trying to increase more than available points", () => {
      const character = new Character("Arthur", validAttributes, []);
      character.attrPoints = 2;

      expect(() => character.increaseAttr("str", 3)).toThrow();
    });

    test("should throw error if trying to increase with non-positive amount", () => {
      const character = new Character("Arthur", validAttributes, []);
      character.attrPoints = 5;

      expect(() => character.increaseAttr("str", 0)).toThrow();
      expect(() => character.increaseAttr("str", -1)).toThrow();
    });
  });

  describe("character should be gain XP and level up accordingly", () => {
    test("gaining XP should increase amount and level", () => {
      const character = new Character("Arthur", validAttributes, []);
      const initialLevel = character.xp.level;

      character.gainRewards({ gold: 0, xp: 1000 }); // Assuming this is enough for at least 1 level up
      expect(character.xp.amount).toBe(1000);
      expect(character.xp.level).toBeGreaterThan(initialLevel);
    });

    test("leveling up should grant attribute points", () => {
      const character = new Character("Arthur", validAttributes, []);
      const initialAttrPoints = character.attrPoints;

      character.gainRewards({ gold: 0, xp: 1000 }); // Assuming this is enough for at least 1 level up
      console.log(character.xp.level);
      expect(character.attrPoints).toBeGreaterThan(initialAttrPoints);
      console.log(character.attrPoints);
    });
  });
});
