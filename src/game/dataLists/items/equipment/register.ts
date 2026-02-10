import type { ItemParam } from "src/game/value-objects/item";
import { earlyEquipmentRegistry } from "src/game/dataLists/items/equipment/early/register";

type EquipmentDefinition = Extract<ItemParam, { type: "equipment" }>;

export const equipmentRegistry: Record<string, EquipmentDefinition> = {
  ...earlyEquipmentRegistry,
};
