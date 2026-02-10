import type { MaterialItemParam } from "src/game/value-objects/item";

/**
 * Generic materials dropped by mobs.
 * Materials are used for crafting, quests, or selling.
 */
export const materialsList: Record<string, MaterialItemParam> = {
  // Beast materials
  wolf_pelt: {
    id: "wolf_pelt",
    type: "material",
    metadata: {
      name: "Wolf Pelt",
      description: "A rough pelt from a wolf. Used in basic leather crafting.",
      rarity: "common",
    },
  },
  wolf_fang: {
    id: "wolf_fang",
    type: "material",
    metadata: {
      name: "Wolf Fang",
      description: "A sharp fang. Can be used for weapons or sold.",
      rarity: "common",
    },
  },
  rat_tail: {
    id: "rat_tail",
    type: "material",
    metadata: {
      name: "Rat Tail",
      description: "A thin, leathery tail. Some alchemists pay for these.",
      rarity: "common",
    },
  },
  rat_hide: {
    id: "rat_hide",
    type: "material",
    metadata: {
      name: "Rat Hide",
      description: "A small piece of rat hide. Low quality leather.",
      rarity: "common",
    },
  },

  // Humanoid materials
  torn_cloth: {
    id: "torn_cloth",
    type: "material",
    metadata: {
      name: "Torn Cloth",
      description: "A piece of cloth torn from bandit garments.",
      rarity: "common",
    },
  },
  bandit_badge: {
    id: "bandit_badge",
    type: "material",
    metadata: {
      name: "Bandit Badge",
      description: "A crude badge worn by bandits. Proof of defeat.",
      rarity: "common",
    },
  },
  rusty_coin: {
    id: "rusty_coin",
    type: "material",
    metadata: {
      name: "Rusty Coin",
      description: "An old, corroded coin. Worth little, but collectible.",
      rarity: "common",
    },
  },

  // Magic materials
  mana_shard: {
    id: "mana_shard",
    type: "material",
    metadata: {
      name: "Mana Shard",
      description: "A small crystallized fragment of magical energy.",
      rarity: "uncommon",
    },
  },
  arcane_dust: {
    id: "arcane_dust",
    type: "material",
    metadata: {
      name: "Arcane Dust",
      description: "Fine dust left behind by magical creatures.",
      rarity: "uncommon",
    },
  },

  // Generic materials
  bone_fragment: {
    id: "bone_fragment",
    type: "material",
    metadata: {
      name: "Bone Fragment",
      description: "A piece of bone. Common crafting material.",
      rarity: "common",
    },
  },
  monster_blood: {
    id: "monster_blood",
    type: "material",
    metadata: {
      name: "Monster Blood",
      description: "A vial of monster blood. Used in alchemy.",
      rarity: "common",
    },
  },
};
