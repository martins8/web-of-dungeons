import { StatKey } from "src/game/value-objects/stats";

// Item core types.
export type ItemType =
  | "consumable"
  | "equipment"
  | "material"
  | "quest"
  | "misc";

export interface ItemMetadata {
  name: string;
  description: string;
  rarity?: string;
  // future extra metadata is allowed
  [key: string]: unknown;
}

// Equipment taxonomy.
export type WeaponType =
  | "sword"
  | "axe"
  | "bow"
  | "staff"
  | "dagger"
  | "mace"
  | "wand"
  | "crossbow"
  | "spear"
  | "fist"
  | "shield";

export type WeaponHandedness = "one-hand" | "twohands";

export type ArmorType = "cloth" | "leather" | "plate";

export type AccessoryType = "accessory";

// Equipment slots.
export type equipmentSlot =
  | "head"
  | "body"
  | "shoulders"
  | "legs"
  | "feet"
  | "hands"
  | "mainhand"
  | "offhand"
  | "necklace"
  | "ring1"
  | "ring2";

type WeaponSlot = "mainhand" | "offhand";

type AccessorySlot = "necklace" | "ring1" | "ring2";

type ArmorSlot =
  | "head"
  | "body"
  | "shoulders"
  | "legs"
  | "feet"
  | "hands"
  | "offhand";

// Equipment item shapes.
type BaseEquipmentItem = {
  slot: equipmentSlot;
  stats: Partial<Record<StatKey, number>>;
};

type WeaponEquipmentItem = BaseEquipmentItem & {
  slot: WeaponSlot;
  weaponType: WeaponType;
  handedness: WeaponHandedness;
  range?: number; // for future use, e.g., bow range
  armorType?: never;
  accessoryType?: never;
};

type ArmorEquipmentItem = BaseEquipmentItem & {
  slot: ArmorSlot;
  armorType: ArmorType;
  weaponType?: never;
  handedness?: never;
  accessoryType?: never;
};

type AccessoryEquipmentItem = BaseEquipmentItem & {
  slot: AccessorySlot;
  accessoryType: AccessoryType;
  weaponType?: never;
  handedness?: never;
  armorType?: never;
};

export type EquipmentItem =
  | WeaponEquipmentItem
  | ArmorEquipmentItem
  | AccessoryEquipmentItem;

// Consumable effects structure.
export interface ConsumableEffects {
  heal?: number;
  mana?: number;
  buffType?: string;
  scaling?: number;
  duration?: number;
  curesEffect?: string;
  [key: string]: unknown;
}

// Constructor params for each item type.
export type MaterialItemParam = {
  id: string;
  type: "material";
  metadata: ItemMetadata;
  effects?: never;
  equipmentItem?: never;
};

export type ConsumableItemParam = {
  id: string;
  type: "consumable";
  metadata: ItemMetadata;
  effects: ConsumableEffects;
  equipmentItem?: never;
};

export type QuestItemParam = {
  id: string;
  type: "quest";
  metadata: ItemMetadata;
  effects?: never;
  equipmentItem?: never;
};

export type MiscItemParam = {
  id: string;
  type: "misc";
  metadata: ItemMetadata;
  effects?: never;
  equipmentItem?: never;
};

export type EquipmentItemParam = {
  id: string;
  type: "equipment";
  metadata: ItemMetadata;
  effects?: never;
  equipmentItem: EquipmentItem;
};

export type ItemParam =
  | MaterialItemParam
  | ConsumableItemParam
  | QuestItemParam
  | MiscItemParam
  | EquipmentItemParam;

export default class Item {
  readonly id: string;
  readonly type: ItemType;
  readonly metadata: ItemMetadata;
  readonly effects: ConsumableEffects | null;
  readonly equipmentItem: EquipmentItem | null;

  constructor({ id, type, metadata, effects, equipmentItem }: ItemParam) {
    this.id = id;
    this.type = type;
    this.metadata = metadata;
    this.effects = type === "consumable" ? (effects ?? null) : null;
    this.equipmentItem = type === "equipment" ? (equipmentItem ?? null) : null;
  }

  // Type guards for narrowing
  isEquipment(): this is Item & {
    equipmentItem: EquipmentItem;
    type: "equipment";
  } {
    return this.type === "equipment" && this.equipmentItem !== null;
  }

  isConsumable(): this is Item & {
    effects: ConsumableEffects;
    type: "consumable";
  } {
    return this.type === "consumable" && this.effects !== null;
  }

  isMaterial(): this is Item & { type: "material" } {
    return this.type === "material";
  }

  isQuest(): this is Item & { type: "quest" } {
    return this.type === "quest";
  }

  isMisc(): this is Item & { type: "misc" } {
    return this.type === "misc";
  }
}
