import type { ItemParam } from "src/game/value-objects/item";
import { equipmentRegistry } from "src/game/dataLists/items/equipment/register";
import { materialsRegistry } from "src/game/dataLists/items/materials/register";
import { consumablesRegistry } from "src/game/dataLists/items/consumables/register";

/**
 * Master item registry that combines all item types.
 * Use this registry for general item lookups across all categories.
 */
export const itemRegistry: Record<string, ItemParam> = {
  ...equipmentRegistry,
  ...materialsRegistry,
  ...consumablesRegistry,
};

// Re-export individual registries for type-specific lookups
export { equipmentRegistry } from "src/game/dataLists/items/equipment/register";
export { materialsRegistry } from "src/game/dataLists/items/materials/register";
export { consumablesRegistry } from "src/game/dataLists/items/consumables/register";
