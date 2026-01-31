/**
 * NORMAL MOBS HAS 8 BASE ATTRS
 * MOBS HAS 10 ATTR POINTS TO DISTRIBUTE
 *
 */
/**
 * mobDefinitions is a simple lookup of mob templates used by the encounter
 * system and factories. Each entry contains:
 * - `name`: display name
 * - `attributes`: base Attributes object shape
 * - `skills`: array of skill ids
 * - `type`: one of normal|rare|elite|boss
 * - `archetype`: category (humanoid, beast, etc)
 * - `description`: human readable description
 */

export const mobDefinitions = {
  wolf_01: {
    name: "Young Wolf",
    attributes: {
      sta: 8,
      str: 8,
      con: 6,
      dex: 10,
      int: 6,
      wis: 6,
      agi: 8,
      cha: 6,
    },
    skills: ["skill_004"],
    type: "normal",
    archetype: "beast",
    description: `a lone young wolf who, after being disowned by 
      his pack, struggles to survive in forest`,
  },
  rat_01: {
    name: "Giant Rat",
    attributes: {
      sta: 6,
      str: 7,
      con: 6,
      dex: 9,
      int: 6,
      wis: 6,
      agi: 12,
      cha: 6,
    },
    skills: ["skill_004"],
    type: "normal",
    archetype: "beast",
    description: `a giant rat`,
  },

  bandit_01: {
    name: "Clumsy Bandit",
    attributes: {
      sta: 6,
      str: 7,
      con: 7,
      dex: 10,
      int: 6,
      wis: 6,
      agi: 10,
      cha: 6,
    },
    skills: ["skill_001"],
    type: "normal",
    archetype: "humanoid",
    description: `This disastrous pickpocket has a 
      great talent for being anything. Except being a thief.`,
  },

  mage_01: {
    name: "Bandit Mage",
    attributes: {
      sta: 6,
      str: 6,
      con: 6,
      dex: 6,
      int: 12,
      wis: 10,
      agi: 6,
      cha: 6,
    },
    skills: ["skill_005"],
    type: "normal",
    archetype: "humanoid",
    description: `This a mage.`,
  },

  bandit_02: {
    name: "Chief Bandit",
    attributes: {
      sta: 9,
      str: 9,
      con: 7,
      dex: 7,
      int: 6,
      wis: 6,
      agi: 8,
      cha: 6,
    },
    skills: ["skill_001"],
    type: "normal",
    archetype: "humanoid",
    description: `This disastrous pickpocket has a 
      great talent for being anything. Except being a thief.`,
  },
};
