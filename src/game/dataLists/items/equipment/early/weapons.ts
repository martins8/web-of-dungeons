import type { ItemParam } from "src/game/value-objects/item";

type EquipmentDefinition = Extract<ItemParam, { type: "equipment" }>;

/*
Contract (equipment weapon):
{
  id: string,
  type: "equipment",
  metadata: { name: string, description: string, rarity?: string },
  equipmentItem: {
    slot: "mainhand" | "offhand",
    stats: Partial<Record<StatKey, number>>,
    weaponType: WeaponType,
    handedness: "one-hand" | "twohands"
  }
}
*/

export const earlyWeapons: Record<string, EquipmentDefinition> = {
  starter_sword: {
    id: "starter_sword",
    type: "equipment",
    metadata: {
      name: "Training Sword",
      description: "A blunt sword used by new recruits.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "mainhand",
      stats: {
        pDmg: 2,
      },
      weaponType: "sword",
      handedness: "one-hand",
      range: 1,
    },
  },
  starter_staff: {
    id: "starter_staff",
    type: "equipment",
    metadata: {
      name: "Apprentice Staff",
      description: "A wooden staff that channels simple magic.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "mainhand",
      stats: {
        mDmg: 2,
        hPower: 1,
      },
      weaponType: "staff",
      handedness: "twohands",
      range: 2,
    },
  },
  starter_shield: {
    id: "starter_shield",
    type: "equipment",
    metadata: {
      name: "Wooden Shield",
      description: "A lightweight shield made of wood planks.",
      rarity: "common",
    },
    equipmentItem: {
      slot: "offhand",
      stats: {
        pDef: 2,
      },
      weaponType: "shield",
      handedness: "one-hand",
      range: 1,
    },
  },
};
