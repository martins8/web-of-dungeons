/**
 * NORMAL MOBS HAS 8 BASE ATTRS
 * MOBS HAS 10 ATTR POINTS TO DISTRIBUTE
 *
 */

export const mobDefinitions = {
  wolf_01: {
    name: "Young Wolf",
    attributes: {
      sta: 10,
      str: 10,
      con: 8,
      dex: 12,
      int: 8,
      wis: 8,
      agi: 10,
      cha: 8,
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
      sta: 8,
      str: 9,
      con: 8,
      dex: 11,
      int: 8,
      wis: 8,
      agi: 14,
      cha: 8,
    },
    skills: ["skill_004"],
    type: "normal",
    archetype: "beast",
    description: `a giant rat`,
  },

  bandit_01: {
    name: "Clumsy Bandit",
    attributes: {
      sta: 8,
      str: 9,
      con: 9,
      dex: 12,
      int: 8,
      wis: 8,
      agi: 12,
      cha: 8,
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
      sta: 8,
      str: 8,
      con: 8,
      dex: 8,
      int: 14,
      wis: 12,
      agi: 8,
      cha: 8,
    },
    skills: ["skill_005"],
    type: "normal",
    archetype: "humanoid",
    description: `This a mage.`,
  },

  bandit_02: {
    name: "Chief Bandit",
    attributes: {
      sta: 11,
      str: 11,
      con: 9,
      dex: 9,
      int: 8,
      wis: 8,
      agi: 10,
      cha: 8,
    },
    skills: ["skill_001"],
    type: "normal",
    archetype: "humanoid",
    description: `This disastrous pickpocket has a 
      great talent for being anything. Except being a thief.`,
  },
};
