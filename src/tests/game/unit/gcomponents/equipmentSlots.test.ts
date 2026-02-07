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

    const slots = new EquipmentsSlots(
      head,
      body,
      shoulders,
      null,
      null,
      null,
      mainhand,
      null,
      necklace,
    );

    expect(slots.head).toEqual(head);
    expect(slots.body).toEqual(body);
    expect(slots.shoulders).toEqual(shoulders);
    expect(slots.mainhand).toEqual(mainhand);
    expect(slots.necklace).toEqual(necklace);
  });

  test("should throw when constructor receives non-equipment item", () => {
    const consumable: ItemParam = {
      id: "potion",
      type: "consumable",
      metadata: {
        name: "Potion",
        description: "Heals",
      },
    };

    expect(() => new EquipmentsSlots(consumable)).toThrow(
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

    expect(() => new EquipmentsSlots(invalidEquipment)).toThrow(
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
});
