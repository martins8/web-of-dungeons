import type { ItemParam } from "src/game/value-objects/item";

type EquipmentDefinition = Extract<ItemParam, { type: "equipment" }>;

/*
Contract (equipment accessory):
{
  id: string,
  type: "equipment",
  metadata: { name: string, description: string, rarity?: string },
  equipmentItem: {
    slot: "necklace" | "ring1" | "ring2",
    stats: Partial<Record<StatKey, number>>,
    accessoryType: "accessory"
  }
}
*/

export const earlyAccessories: Record<string, EquipmentDefinition> = {
  starter_amulet: {
    id: "starter_amulet",
    type: "equipment",
    metadata: {
      name: "Simple Amulet",
      description: "A small charm that brings a little vitality.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "necklace",
      stats: {
        maxHp: 5,
      },
      accessoryType: "accessory",
    },
  },
  starter_ring_1: {
    id: "starter_ring_1",
    type: "equipment",
    metadata: {
      name: "Copper Ring",
      description: "A plain ring that seems slightly lucky.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "ring1",
      stats: {
        luck: 1,
      },
      accessoryType: "accessory",
    },
  },
  starter_ring_2: {
    id: "starter_ring_2",
    type: "equipment",
    metadata: {
      name: "Copper Ring",
      description: "A plain ring that seems slightly lucky.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "ring2",
      stats: {
        luck: 1,
      },
      accessoryType: "accessory",
    },
  },
};
