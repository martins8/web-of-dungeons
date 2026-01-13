import Skill from "src/game/gcomponents/skill";

const buffSkills = [
  new Skill({
    id: "buff_001",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { str: 1 },
      ticks: 5,
    },
    metadata: {
      name: "War Shout",
      text: "Increase STR +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_002",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { int: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Great Intellect",
      text: "Increase INT +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_003",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { wis: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Wisdom Chant",
      text: "Increase WIS +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_004",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { con: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Iron Body",
      text: "Increase CON +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_005",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { sta: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Endurance Cry",
      text: "Increase STA +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_006",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { dex: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Precision Focus",
      text: "Increase DEX +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_007",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    cooldown: 0,
    effects: {
      effectType: "attribute",
      buff: { agi: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Agile Step",
      text: "Increase AGI +1",
      rarity: "common",
    },
  }),
  new Skill({
    id: "buff_008",
    rank: 1,
    typeSkill: "buff",
    reach: "global",
    effects: {
      effectType: "attribute",
      buff: { cha: 1 },
      ticks: 5,
    },
    metadata: {
      name: "Charisma Aura",
      text: "Increase CHA +1",
      rarity: "common",
    },
  }),
];

export default buffSkills;
