import type { MaterialItemParam } from "src/game/value-objects/item";
import { materialsList } from "src/game/dataLists/items/materials/list";

export const materialsRegistry: Record<string, MaterialItemParam> = {
  ...materialsList,
};

export { materialsList };
