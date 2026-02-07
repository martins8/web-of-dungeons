import type { ItemParam } from "src/game/value-objects/item";
import { earlyArmors } from "src/game/dataLists/equipment/early/armors";
import { earlyWeapons } from "src/game/dataLists/equipment/early/weapons";
import { earlyAccessories } from "src/game/dataLists/equipment/early/accessories";

type EquipmentDefinition = Extract<ItemParam, { type: "equipment" }>;

const earlyEquipmentList: EquipmentDefinition[] = [
  ...Object.values(earlyArmors),
  ...Object.values(earlyWeapons),
  ...Object.values(earlyAccessories),
];

export const earlyEquipmentRegistry: Record<string, EquipmentDefinition> =
  Object.fromEntries(
    earlyEquipmentList.map((equipment) => [equipment.id, equipment]),
  ) as Record<string, EquipmentDefinition>;

export { earlyArmors, earlyWeapons, earlyAccessories };
