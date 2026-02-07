import type { ItemParam } from "src/game/value-objects/item";

type EquipmentDefinition = Extract<ItemParam, { type: "equipment" }>;

/*
Contract (equipment armor):
{
  id: string,
  type: "equipment",
  metadata: { name: string, description: string, rarity?: string },
  equipmentItem: {
    slot: "head" | "body" | "shoulders" | "legs" | "feet" | "hands" | "offhand",
    stats: Partial<Record<StatKey, number>>,
    armorType: "cloth" | "leather" | "plate"
  }
}
*/

export const earlyArmors: Record<string, EquipmentDefinition> = {
  starter_cap: {
    id: "starter_cap",
    type: "equipment",
    metadata: {
      name: "Cloth Cap",
      description: "A simple cloth cap for basic protection.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "head",
      stats: {
        pDef: 1,
      },
      armorType: "cloth",
    },
  },
  starter_tunic: {
    id: "starter_tunic",
    type: "equipment",
    metadata: {
      name: "Traveler Tunic",
      description: "Light fabric armor for new adventurers.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "body",
      stats: {
        pDef: 2,
        maxHp: 5,
      },
      armorType: "cloth",
    },
  },
  starter_shoulders: {
    id: "starter_shoulders",
    type: "equipment",
    metadata: {
      name: "Cloth Mantle",
      description: "A light mantle that covers the shoulders.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "shoulders",
      stats: {
        pDef: 1,
        mDef: 1,
      },
      armorType: "cloth",
    },
  },
  starter_leggings: {
    id: "starter_leggings",
    type: "equipment",
    metadata: {
      name: "Worn Leggings",
      description: "Comfortable leggings with minimal protection.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "legs",
      stats: {
        pDef: 1,
        speed: 1,
      },
      armorType: "cloth",
    },
  },
  starter_boots: {
    id: "starter_boots",
    type: "equipment",
    metadata: {
      name: "Leather Boots",
      description: "Sturdy boots that help with long travel.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "feet",
      stats: {
        speed: 1,
        eva: 1,
      },
      armorType: "leather",
    },
  },
  starter_gloves: {
    id: "starter_gloves",
    type: "equipment",
    metadata: {
      name: "Leather Gloves",
      description: "Light gloves for better grip.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "hands",
      stats: {
        critC: 1,
      },
      armorType: "leather",
    },
  },
};
