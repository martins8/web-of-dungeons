import EquipmentsSlots from "src/game/gcomponents/equipmentSlots";
import type { ItemParam } from "src/game/value-objects/item";

const makeArmor = (
  id: string,
  slot: "head" | "body" | "shoulders",
): Extract<ItemParam, { type: "equipment" }> => ({
  id,
  type: "equipment",
  metadata: {
    name: `Armor ${id}`,
    description: "Test armor",
  },
  equipmentItem: {
    slot,
    stats: {
      pDef: 1,
    },
    armorType: "cloth",
  },
});

const makeWeapon = (
  id: string,
  slot: "mainhand" | "offhand",
): Extract<ItemParam, { type: "equipment" }> => ({
  id,
  type: "equipment",
  metadata: {
    name: `Weapon ${id}`,
    description: "Test weapon",
  },
  equipmentItem: {
    slot,
    stats: {
      pDmg: 1,
    },
    weaponType: "sword",
    handedness: "one-hand",
  },
});

const makeAccessory = (
  id: string,
  slot: "necklace" | "ring1" | "ring2",
): Extract<ItemParam, { type: "equipment" }> => ({
  id,
  type: "equipment",
  metadata: {
    name: `Accessory ${id}`,
    description: "Test accessory",
  },
  equipmentItem: {
    slot,
    stats: {
      luck: 1,
    },
    accessoryType: "accessory",
  },
});

describe("EquipmentsSlots", () => {
  test("should initialize with null slots by default", () => {
    const slots = new EquipmentsSlots();

    expect(slots.head).toBeNull();
    expect(slots.body).toBeNull();
    expect(slots.shoulders).toBeNull();
    expect(slots.legs).toBeNull();
    expect(slots.feet).toBeNull();
    expect(slots.hands).toBeNull();
    expect(slots.mainhand).toBeNull();
    expect(slots.offhand).toBeNull();
    expect(slots.necklace).toBeNull();
    expect(slots.ring1).toBeNull();
    expect(slots.ring2).toBeNull();
  });

  test("should accept valid equipment items in constructor", () => {
    const head = makeArmor("cap", "head");
    const body = makeArmor("tunic", "body");
    const shoulders = makeArmor("mantle", "shoulders");
    const mainhand = makeWeapon("sword", "mainhand");
    const necklace = makeAccessory("amulet", "necklace");

    const slots = new EquipmentsSlots({
      head,
      body,
      shoulders,
      mainhand,
      necklace,
    });

    expect(slots.head).toEqual(head);
    expect(slots.body).toEqual(body);
    expect(slots.shoulders).toEqual(shoulders);
    expect(slots.mainhand).toEqual(mainhand);
    expect(slots.necklace).toEqual(necklace);
  });

  test("should accept named slot initialization without null placeholders", () => {
    const head = makeArmor("cap", "head");
    const shoulders = makeArmor("mantle", "shoulders");
    const mainhand = makeWeapon("sword", "mainhand");
    const necklace = makeAccessory("amulet", "necklace");

    const slots = new EquipmentsSlots({
      head,
      shoulders,
      mainhand,
      necklace,
    });

    expect(slots.head).toEqual(head);
    expect(slots.shoulders).toEqual(shoulders);
    expect(slots.mainhand).toEqual(mainhand);
    expect(slots.necklace).toEqual(necklace);
    expect(slots.body).toBeNull();
  });

  test("should throw when constructor receives non-equipment item", () => {
    const consumable: ItemParam = {
      id: "potion",
      type: "consumable",
      metadata: {
        name: "Potion",
        description: "Heals",
      },
      effects: {},
    };

    expect(() => new EquipmentsSlots({ head: consumable })).toThrow(
      "Invalid item type for equipment slot: consumable",
    );
  });

  test("should throw when equipment item data is missing", () => {
    const invalidEquipment = {
      id: "broken",
      type: "equipment",
      metadata: {
        name: "Broken",
        description: "Missing equipmentItem",
      },
    } as ItemParam;

    expect(() => new EquipmentsSlots({ head: invalidEquipment })).toThrow(
      "Equipment item data is required for equipment slots.",
    );
  });

  test("should equip and unequip items", () => {
    const slots = new EquipmentsSlots();
    const ring = makeAccessory("ring", "ring1");

    slots.equipItem("ring1", ring);
    expect(slots.ring1).toEqual(ring);

    slots.unequipItem("ring1");
    expect(slots.ring1).toBeNull();
  });

  test("should reject slot mismatch when equipping", () => {
    const slots = new EquipmentsSlots();
    const weapon = makeWeapon("sword", "mainhand");

    expect(() => slots.equipItem("offhand", weapon)).toThrow(
      "Equipment slot mismatch: item is mainhand but slot is offhand",
    );
  });

  test("should return item by id", () => {
    const head = makeArmor("cap", "head");
    const slots = new EquipmentsSlots({ head });

    const foundItem = slots.getEquippedItemById("cap");
    expect(foundItem).toEqual(head);

    const notFoundItem = slots.getEquippedItemById("nonexistent");
    expect(notFoundItem).toBeNull();
  });

  test("should return list of equipped items", () => {
    const head = makeArmor("cap", "head");
    const body = makeArmor("tunic", "body");
    const mainhand = makeWeapon("sword", "mainhand");

    const slots = new EquipmentsSlots({ head, body, mainhand });

    const equippedItems = slots.getListEquippedItems();
    console.log(equippedItems);
    expect(equippedItems).toHaveLength(3);
    expect(equippedItems).toEqual(
      expect.arrayContaining([head, body, mainhand]),
    );
  });

  test("should return equipped items as a record", () => {
    const head = makeArmor("cap", "head");
    const body = makeArmor("tunic", "body");
    const mainhand = makeWeapon("sword", "mainhand");

    const slots = new EquipmentsSlots({ head, body, mainhand });

    const equippedItems = slots.getEquippedItems();
    console.log(equippedItems);
    expect(Object.keys(equippedItems)).toHaveLength(3);
    expect(equippedItems).toEqual({
      head,
      body,
      mainhand,
    });
  });
});
