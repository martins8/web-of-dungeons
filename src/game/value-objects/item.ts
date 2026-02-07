import { StatKey } from "src/game/value-objects/stats";

// Item core types.
export type ItemType =
  | "consumable"
  | "equipment"
  | "material"
  | "quest"
  | "misc"
  | unknown;

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

// Constructor params.
type BaseItemParam = {
  id: string;
  type: Exclude<ItemType, "equipment">;
  metadata: ItemMetadata;
  equipmentItem?: never;

  //effect: (character: Character) => void;
};

type EquipmentItemParam = {
  id: string;
  type: "equipment";
  metadata: ItemMetadata;
  equipmentItem: EquipmentItem;

  //effect: (character: Character) => void;
};

export type ItemParam = BaseItemParam | EquipmentItemParam;

export default class Item {
  id: string;
  type: ItemType;
  metadata: {
    name: string;
    description: string;
  };
  equipmentItem: EquipmentItem | null;

  constructor({ id, type, metadata, equipmentItem }: ItemParam) {
    this.id = id;
    this.type = type;
    this.metadata = metadata;
    this.equipmentItem = type === "equipment" ? (equipmentItem ?? null) : null;
  }
}
