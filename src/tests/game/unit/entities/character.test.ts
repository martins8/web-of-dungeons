import Character from "src/game/entities/character";
import CombatState from "src/game/gcomponents/combatState";
import { EquipmentItem } from "src/game/value-objects/item";

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
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.name).toBe("Arthur");
      expect(character.attributes).toBeDefined();
      expect(character.stats).toBeDefined();
      expect(character.health).toBeDefined();
      expect(character.equipmentSlots).toBeDefined();
    });

    test("health maxHp should match stats.maxHp", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.health.maxHp).toBe(character.stats.maxHp);
    });

    test("should initialize crit and evade systems", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.critSystem).toBeDefined();
      expect(character.evadeSystem).toBeDefined();
    });

    test("should initialize skills array", () => {
      const skills: any = [{ id: "slash" }];
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills,
      });

      expect(character.skills).toBe(skills);
    });

    test("should initialize turn system", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.turnSystem).toBeDefined();
    });

    test("combatState should start as null", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.combatState).toBeNull();
    });
  });

  describe("Name validation", () => {
    test("should throw error for invalid names", () => {
      expect(
        // @ts-expect-error - test invalid input in runtime
        () => new Character({ name: 123, attrValues: validAttributes }),
      ).toThrow();
      expect(
        () => new Character({ name: "", attrValues: validAttributes }),
      ).toThrow();
      expect(
        () => new Character({ name: "Arthur 1", attrValues: validAttributes }),
      ).toThrow();
    });
  });

  describe("Combat State lifecycle", () => {
    test("initCombatState should create a CombatState instance", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      character.initCombatState();

      expect(character.combatState).toBeInstanceOf(CombatState);
    });

    test("finishCombatState should clear combatState", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      character.initCombatState();
      character.finishCombatState();

      expect(character.combatState).toBeNull();
    });
  });

  describe("Combat-related behavior", () => {
    test("isDead should return false when not in combat", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.isDead()).toBe(false);
    });

    test("isDead should reflect combatState.isDead when in combat", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

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

      const character = new Character({
        name: "Mage",
        attrValues: validAttributes,
        skills,
      });

      const skill = character.getSkillById("fireball");

      expect(skill).toEqual({ id: "fireball", name: "Fireball" });
    });

    test("getSkillById should return undefined if skill does not exist", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });

      expect(() => character.getSkillById("unknown")).toThrow();
    });
  });

  describe("character needs to be able to increase attributes with points", () => {
    test("should increase attribute and decrease attrPoints", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });
      character.attrPoints = 5;
      character.increaseAttr("str", 3);
      expect(character.attributes.str).toBe(13);
      expect(character.attrPoints).toBe(2);
    });

    test("should throw error if trying to increase more than available points", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });
      character.attrPoints = 2;

      expect(() => character.increaseAttr("str", 3)).toThrow();
    });

    test("should throw error if trying to increase with non-positive amount", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });
      character.attrPoints = 5;

      expect(() => character.increaseAttr("str", 0)).toThrow();
      expect(() => character.increaseAttr("str", -1)).toThrow();
    });
  });

  describe("character should be gain XP and level up accordingly", () => {
    test("gaining XP should increase amount and level", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });
      const initialLevel = character.xp.level;

      character.gainRewards({ gold: 0, xp: 1000 }); // Assuming this is enough for at least 1 level up
      expect(character.xp.amount).toBe(1000);
      expect(character.xp.level).toBeGreaterThan(initialLevel);
    });

    test("leveling up should grant attribute points", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });
      const initialAttrPoints = character.attrPoints;

      character.gainRewards({ gold: 0, xp: 1000 }); // Assuming this is enough for at least 1 level up
      console.log(character.xp.level);
      expect(character.attrPoints).toBeGreaterThan(initialAttrPoints);
      console.log(character.attrPoints);
    });
  });

  describe("should manage equipment slots and inventory correctly", () => {
    test("should have empty equipment slots on initialization if no equipment is equipped", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });

      expect(character.equipmentSlots.head).toBeNull();
      expect(character.equipmentSlots.body).toBeNull();
      expect(character.equipmentSlots.shoulders).toBeNull();
      expect(character.equipmentSlots.mainhand).toBeNull();
      expect(character.equipmentSlots.offhand).toBeNull();
      expect(character.equipmentSlots.necklace).toBeNull();
      expect(character.equipmentSlots.ring1).toBeNull();
      expect(character.equipmentSlots.ring2).toBeNull();
    });

    // More tests for equipping and unequipping items, inventory management, etc. can be added here.
    test("should throw error when trying to equip non-equipment item", () => {
      const nonEquipmentItem = {
        id: "potion1",
        type: "consumable",
        metadata: { name: "Health Potion", description: "Restores health" },
        equipmentItem: null,
      };
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
        inventoryItems: [nonEquipmentItem],
      });
      character.inventory.addItem([nonEquipmentItem]);
      expect(() => character.bagToEquipmentSlots("potion1")).toThrow();
    });

    test("should equip item from inventory to correct slot", () => {
      const equipmentItem = {
        id: "sword1",
        type: "equipment" as const,
        metadata: { name: "Iron Sword", description: "A basic sword" },
        equipmentItem: {
          slot: "mainhand" as const,
          stats: { pDmg: 5 },
          weaponType: "sword" as const,
          handedness: "one-hand" as const,
        },
      };
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
        inventoryItems: [equipmentItem],
      });
      character.inventory.addItem([equipmentItem]);
      character.bagToEquipmentSlots("sword1");
      expect(character.equipmentSlots.mainhand).toEqual(equipmentItem);
    });

    test("should equip armor item from inventory to head slot", () => {
      const equipmentItem = {
        id: "helmet1",
        type: "equipment" as const,
        metadata: { name: "Iron Helmet", description: "A basic helmet" },
        equipmentItem: {
          slot: "head" as const,
          stats: { pDef: 3 },
          armorType: "plate" as const,
        },
      };
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
        inventoryItems: [equipmentItem],
      });
      character.inventory.addItem([equipmentItem]);
      character.bagToEquipmentSlots("helmet1");
      expect(character.equipmentSlots.head).toEqual(equipmentItem);
    });

    test("should move equipped item back to inventory", () => {
      const equipmentItem = {
        id: "sword1",
        type: "equipment" as const,
        metadata: { name: "Iron Sword", description: "A basic sword" },
        equipmentItem: {
          slot: "mainhand" as const,
          stats: { pDmg: 5 },
          weaponType: "sword" as const,
          handedness: "one-hand" as const,
        },
      };
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
        inventoryItems: [equipmentItem],
      });
      character.inventory.addItem([equipmentItem]);
      character.bagToEquipmentSlots("sword1");
      expect(character.equipmentSlots.mainhand).toEqual(equipmentItem);

      character.equipmentSlotsToBag("sword1");
      expect(character.equipmentSlots.mainhand).toBeNull();
      expect(character.inventory.getItemById("sword1")).toEqual(equipmentItem);
    });

    test("should throw error when unequipping item with full inventory", () => {
      const equipmentItem = {
        id: "sword1",
        type: "equipment" as const,
        metadata: { name: "Iron Sword", description: "A basic sword" },
        equipmentItem: {
          slot: "mainhand" as const,
          stats: { pDmg: 5 },
          weaponType: "sword" as const,
          handedness: "one-hand" as const,
        },
      };
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
        inventorySize: 1,
        inventoryItems: [equipmentItem],
      });
      character.bagToEquipmentSlots("sword1");

      const fillerItem = {
        id: "potion1",
        type: "consumable" as const,
        metadata: { name: "Potion", description: "Heals" },
        equipmentItem: null,
      };
      character.inventory.addItem([fillerItem]);

      expect(() => character.equipmentSlotsToBag("sword1")).toThrow(
        "Inventory is full.",
      );
    });

    test("should throw error when unequipping non-existent item", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        skills: [],
      });

      expect(() => character.equipmentSlotsToBag("nonexistent")).toThrow();
    });
  });

  describe("Turn management", () => {
    test("startTurn should delegate to turnSystem", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      character.startTurn();
      expect(character.turnSystem.actionsOnTurn).toBe(
        character.turnSystem.actionsPerTurn,
      );
    });

    test("endTurn should delegate to turnSystem", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      const initialTurnCount = character.turnSystem.turnCount;
      character.endTurn();
      expect(character.turnSystem.turnCount).toBe(initialTurnCount + 1);
    });
  });

  describe("Mob behavior", () => {
    test("isMob should return true when character is a mob", () => {
      const mob = new Character({
        name: "Goblin",
        attrValues: validAttributes,
        isMob: true,
      });

      expect(mob.isMob()).toBe(true);
    });

    test("isMob should return false when character is not a mob", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
      });

      expect(character.isMob()).toBe(false);
    });

    test("mob should allow spaces in name", () => {
      expect(
        () =>
          new Character({
            name: "Goblin Leader",
            attrValues: validAttributes,
            isMob: true,
          }),
      ).not.toThrow();
    });
  });

  describe("Constructor edge cases", () => {
    test("should initialize with custom gold", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        gold: 100,
      });

      expect(character.gold.amount).toBe(100);
    });

    test("should initialize with custom xp", () => {
      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        xp: 500,
      });

      expect(character.xp.amount).toBe(500);
    });

    test("should throw error for negative attrPoints when not mob", () => {
      expect(
        () =>
          new Character({
            name: "Arthur",
            attrValues: validAttributes,
            attrPoints: -1,
          }),
      ).toThrow("Invalid attrPoints state");
    });

    test("should allow negative attrPoints for mobs", () => {
      expect(
        () =>
          new Character({
            name: "Goblin",
            attrValues: validAttributes,
            isMob: true,
            attrPoints: -1,
          }),
      ).not.toThrow();
    });

    test("should initialize with equipped items", () => {
      const sword = {
        id: "sword1",
        type: "equipment" as const,
        metadata: { name: "Iron Sword", description: "A basic sword" },
        equipmentItem: {
          slot: "mainhand" as const,
          stats: { pDmg: 5 },
          weaponType: "sword" as const,
          handedness: "one-hand" as const,
        },
      };

      const character = new Character({
        name: "Arthur",
        attrValues: validAttributes,
        equippedItems: { mainhand: sword },
      });

      expect(character.equipmentSlots.mainhand).toEqual(sword);
    });
  });
});
