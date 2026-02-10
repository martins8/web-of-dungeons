import Item from "src/game/value-objects/item";

export default class Inventory {
  items: Item[];
  slots: number;

  constructor(size: number = 20, items: Item[] = []) {
    this.validateAddItem(items, size);
    this.slots = size;
    this.items = items;
  }

  private validateAddItem(items: Item[], slots: number): void {
    if (items.length > slots) {
      throw new Error("Not enough inventory slots.");
    }
  }

  public addItem(items: Item[]): void {
    const availableSlots = this.slots - this.items.length;
    if (items.length > availableSlots) {
      throw new Error(`Not enough slots. Available: ${availableSlots}`);
    }
    this.items.push(...items);
  }

  public removeItem(itemId: string): void {
    const index = this.items.findIndex((item) => item.id === itemId);
    if (index === -1) {
      throw new Error("Item not found in inventory.");
    }
    this.items.splice(index, 1);
  }

  public getItemById(itemId: string): Item | null {
    const item = this.items.find((item) => item.id === itemId);
    return item || null;
  }

  public isFull(): boolean {
    return this.items.length >= this.slots;
  }
}
