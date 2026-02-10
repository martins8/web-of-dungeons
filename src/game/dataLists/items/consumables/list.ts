import type { ConsumableItemParam } from "src/game/value-objects/item";

/**
 * Generic consumables that can be used by characters.
 * Consumables provide immediate effects like healing, buffs, etc.
 */
export const consumablesList: Record<string, ConsumableItemParam> = {
  // Healing consumables
  minor_health_potion: {
    id: "minor_health_potion",
    type: "consumable",
    metadata: {
      name: "Minor Health Potion",
      description: "A small vial of red liquid. Restores a small amount of HP.",
      rarity: "common",
    },
    effects: { heal: 20 },
  },
  health_potion: {
    id: "health_potion",
    type: "consumable",
    metadata: {
      name: "Health Potion",
      description: "A vial of red liquid. Restores HP.",
      rarity: "common",
    },
    effects: { heal: 50 },
  },
  greater_health_potion: {
    id: "greater_health_potion",
    type: "consumable",
    metadata: {
      name: "Greater Health Potion",
      description:
        "A large vial of concentrated red liquid. Restores significant HP.",
      rarity: "uncommon",
    },
    effects: { heal: 100 },
  },

  // Food consumables
  bread: {
    id: "bread",
    type: "consumable",
    metadata: {
      name: "Bread",
      description: "Simple bread. Restores a tiny amount of HP over time.",
      rarity: "common",
    },
    effects: { heal: 10 },
  },
  cheese: {
    id: "cheese",
    type: "consumable",
    metadata: {
      name: "Cheese",
      description: "A wedge of cheese. Provides minor sustenance.",
      rarity: "common",
    },
    effects: { heal: 15 },
  },
  cooked_meat: {
    id: "cooked_meat",
    type: "consumable",
    metadata: {
      name: "Cooked Meat",
      description: "Well-cooked meat. Restores HP and provides energy.",
      rarity: "common",
    },
    effects: { heal: 30 },
  },

  // Buff consumables
  strength_elixir: {
    id: "strength_elixir",
    type: "consumable",
    metadata: {
      name: "Strength Elixir",
      description: "A bubbling elixir that temporarily increases strength.",
      rarity: "uncommon",
    },
    effects: { buffType: "str", scaling: 3, duration: 5 },
  },
  agility_elixir: {
    id: "agility_elixir",
    type: "consumable",
    metadata: {
      name: "Agility Elixir",
      description: "A swift elixir that temporarily increases agility.",
      rarity: "uncommon",
    },
    effects: { buffType: "agi", scaling: 3, duration: 5 },
  },
  antidote: {
    id: "antidote",
    type: "consumable",
    metadata: {
      name: "Antidote",
      description: "Cures poison effects.",
      rarity: "common",
      curesEffect: "poison",
    },
    effects: { curesEffect: "poison" },
  },
};
