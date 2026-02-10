import type { ConsumableItemParam } from "src/game/value-objects/item";
import { consumablesList } from "src/game/dataLists/items/consumables/list";

export const consumablesRegistry: Record<string, ConsumableItemParam> = {
  ...consumablesList,
};

export { consumablesList };
