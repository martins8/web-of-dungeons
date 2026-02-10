import type { ItemParam } from "src/game/value-objects/item";
import { StatKey } from "../value-objects/stats";

type EquipmentItemParam = Extract<ItemParam, { type: "equipment" }>;

export type EquipmentSlotKey =
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

export type EquipmentSlotsInit = Partial<
  Record<EquipmentSlotKey, ItemParam | null>
>;

type EquipmentStatsSnapshot = Partial<Record<StatKey, number>>;

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

  constructor(init: EquipmentSlotsInit = {}) {
    this.head = this.ensureEquipmentItem(init.head ?? null);
    this.body = this.ensureEquipmentItem(init.body ?? null);
    this.shoulders = this.ensureEquipmentItem(init.shoulders ?? null);
    this.legs = this.ensureEquipmentItem(init.legs ?? null);
    this.feet = this.ensureEquipmentItem(init.feet ?? null);
    this.hands = this.ensureEquipmentItem(init.hands ?? null);
    this.mainhand = this.ensureEquipmentItem(init.mainhand ?? null);
    this.offhand = this.ensureEquipmentItem(init.offhand ?? null);
    this.necklace = this.ensureEquipmentItem(init.necklace ?? null);
    this.ring1 = this.ensureEquipmentItem(init.ring1 ?? null);
    this.ring2 = this.ensureEquipmentItem(init.ring2 ?? null);
  }

  // Helper method to ensure the item is a valid equipment item or null.
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

  // Equip an item to the specified slot, replacing any existing item.
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

  // Unequip the item from the specified slot, setting it to null.
  public unequipItem(slot: EquipmentSlotKey): void {
    (this as any)[slot] = null;
  }

  // Get the equipped item from a specific slot.
  public getEquippedItem(slot: EquipmentSlotKey): EquipmentItemParam | null {
    return (this as any)[slot] ?? null;
  }

  // Get the equipped item by its ID, searching through all slots.
  public getEquippedItemById(id: string): EquipmentItemParam | null {
    const allSlots: EquipmentItemParam[] = [
      this.head,
      this.body,
      this.shoulders,
      this.legs,
      this.feet,
      this.hands,
      this.mainhand,
      this.offhand,
      this.necklace,
      this.ring1,
      this.ring2,
    ].filter((item): item is EquipmentItemParam => item !== null);

    return allSlots.find((item) => item.id === id) || null;
  }

  public getListEquippedItems(): EquipmentItemParam[] {
    const allSlots: EquipmentItemParam[] = Object.values(this).filter(
      (item): item is EquipmentItemParam => item !== null,
    );
    return allSlots;
  }

  public getEquippedItems(): Record<string, EquipmentItemParam> {
    const equippedItems: Record<string, EquipmentItemParam> = {};
    Object.entries(this).forEach(([slot, item]) => {
      if (item) {
        equippedItems[slot] = item;
      }
    });
    return equippedItems;
  }
}
