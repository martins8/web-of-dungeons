import Effect from "src/game/value-objects/effect";
import Skill from "src/game/value-objects/skill";
/* 
  name: name of the skill
  types: offensive, defensive, buff, moviment
  text: describe action
  rarity: define how much the player can use this on the dice    <---- future feature
          common, rare, epic, ultimate
  damage: base damage
  modifiers: modifiers values that will make damage
  *initial idea: buffs dont have modifiers, her scales jsut for skill rank
  *skill will be used for some classe to recalculate skill damage or buff effect
  example: damage = damage * rank

effecttype = dot | hot | buff | debuff | cc
subtypes------ 
dot = bleed | poison | magical
hot = 
buff = stats | attribute 
debuff = stats | attribute 
cc = stun | silence | slow | rooted

mechanics: stack, refresh
*/

const physicalSkillsList = [
  new Skill({
    id: "skill_001",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 0,
    damage: {
      typeDamage: "physical",
      scaling: {
        pDmg: 1,
      },
    },
    metadata: {
      name: "Basic Attack",
      text: "a basic attack",
      rarity: "common",
    },
  }),
  new Skill({
    id: "skill_002",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 2,
    damage: {
      typeDamage: "physical",
      scaling: {
        pDmg: 1.1,
        maestry: 0.5,
      },
    },
    metadata: {
      name: "Sword Strike",
      text: "Dieee!!!",
      rarity: "common",
    },
  }),
  new Skill({
    id: "skill_003",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 2,
    damage: {
      typeDamage: "physical",
      scaling: {
        pDmg: 0.2,
      },
    },
    effects: new Effect({
      target: "enemy",
      effectType: "dot",
      subtype: "bleed",
      scaling: {
        pDmg: 0.9,
      },
      duration: 5,
    }),
    metadata: {
      name: "Bleeeeeeed",
      text: "put your enemy to bleed",
      rarity: "common",
    },
  }),
  new Skill({
    id: "skill_004",
    rank: 1,
    typeSkill: "action",
    reach: "melee",
    cooldown: 0,
    damage: {
      typeDamage: "physical",
      scaling: {
        pDmg: 0.5,
      },
    },
    effects: new Effect({
      id: "effect_001",
      target: "enemy",
      effectType: "dot",
      mechanic: "refresh",
      subtype: "bleed",
      scaling: {
        pDmg: 0.1,
      },
      duration: 5,
    }),
    metadata: {
      name: "Bite",
      text: "Biteeeeeeeee",
      rarity: "common",
    },
  }),
];

export default physicalSkillsList;
