import type { ItemParam } from "src/game/value-objects/item";

type EquipmentItemParam = Extract<ItemParam, { type: "equipment" }>;

type EquipmentSlotKey =
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

export default class EquipmentsSlots {
  head: EquipmentItemParam | null;
  body: EquipmentItemParam | null;
  shoulders: EquipmentItemParam | null;
  legs: EquipmentItemParam | null;
  feet: EquipmentItemParam | null;
  hands: EquipmentItemParam | null;
  mainhand: EquipmentItemParam | null;
  offhand: EquipmentItemParam | null;
  necklace: EquipmentItemParam | null;
  ring1: EquipmentItemParam | null;
  ring2: EquipmentItemParam | null;

  constructor(
    head: ItemParam | null = null,
    body: ItemParam | null = null,
    shoulders: ItemParam | null = null,
    legs: ItemParam | null = null,
    feet: ItemParam | null = null,
    hands: ItemParam | null = null,
    mainhand: ItemParam | null = null,
    offhand: ItemParam | null = null,
    necklace: ItemParam | null = null,
    ring1: ItemParam | null = null,
    ring2: ItemParam | null = null,
  ) {
    this.head = this.ensureEquipmentItem(head);
    this.body = this.ensureEquipmentItem(body);
    this.shoulders = this.ensureEquipmentItem(shoulders);
    this.legs = this.ensureEquipmentItem(legs);
    this.feet = this.ensureEquipmentItem(feet);
    this.hands = this.ensureEquipmentItem(hands);
    this.mainhand = this.ensureEquipmentItem(mainhand);
    this.offhand = this.ensureEquipmentItem(offhand);
    this.necklace = this.ensureEquipmentItem(necklace);
    this.ring1 = this.ensureEquipmentItem(ring1);
    this.ring2 = this.ensureEquipmentItem(ring2);
  }

  private ensureEquipmentItem(
    item: ItemParam | null,
  ): EquipmentItemParam | null {
    if (item === null) return null;
    if (item.type !== "equipment") {
      throw new Error(`Invalid item type for equipment slot: ${item.type}`);
    }
    if (!item.equipmentItem) {
      throw new Error("Equipment item data is required for equipment slots.");
    }
    return item;
  }

  public equipItem(slot: EquipmentSlotKey, item: ItemParam): void {
    if (item.type !== "equipment") {
      throw new Error(`Invalid item type for equipment slot: ${item.type}`);
    }
    if (!item.equipmentItem) {
      throw new Error("Equipment item data is required for equipment slots.");
    }
    if (item.equipmentItem.slot !== slot) {
      throw new Error(
        `Equipment slot mismatch: item is ${item.equipmentItem.slot} but slot is ${slot}`,
      );
    }
    (this as any)[slot] = this.ensureEquipmentItem(item);
  }

  public unequipItem(slot: EquipmentSlotKey): void {
    (this as any)[slot] = null;
  }
}
