import Item, { type ItemParam } from "src/game/value-objects/item";
import { itemRegistry } from "src/game/dataLists/items/register";

/**
 * ItemFactory creates Item instances from registered item definitions.
 * Following DDD patterns, this factory encapsulates item creation logic.
 */
export default class ItemFactory {
  private static registries: Record<string, ItemParam>[] = [itemRegistry];

  /**
   * Creates an Item instance from its ID by looking up the definition
   * in registered item registries.
   */
  static fromItemId(id: string): Item {
    for (const registry of this.registries) {
      const def = registry[id];
      if (def) {
        return new Item(def);
      }
    }

    throw new Error(`Item with id '${id}' not found in any registry`);
  }

  /**
   * Check if an item ID exists in any registry.
   */
  static exists(id: string): boolean {
    for (const registry of this.registries) {
      if (registry[id]) {
        return true;
      }
    }
    return false;
  }

  /**
   * Get the raw item definition without creating an instance.
   */
  static getDefinition(id: string): ItemParam | null {
    for (const registry of this.registries) {
      const def = registry[id];
      if (def) {
        return def;
      }
    }
    return null;
  }
}
