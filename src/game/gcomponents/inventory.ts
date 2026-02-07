export type Items = {
  id: string;
  type: "consumable" | "equipment" | "material" | "quest" | "misc";
  metadata: {
    name: string;
    description: string;
  };

  //effect: (character: Character) => void;
};

export default class Inventory {
  items: Items[];
  slots: number;

  constructor(size: number = 20, items: Items[] = []) {
    this.validateAddItem(items, size);
    this.slots = size;
    this.items = items;
  }

  private validateAddItem(items: Items[], slots: number): void {
    if (items.length > slots) {
      throw new Error("Not enough inventory slots.");
    }
  }

  public addItem(items: Items[]): void {
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

  public getItemById(itemId: string): Items | null {
    const item = this.items.find((item) => item.id === itemId);
    return item || null;
  }
}
