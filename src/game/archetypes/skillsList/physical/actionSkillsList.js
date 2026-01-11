import ActionSkill from "src/game/gcomponents/skills/actionSkill";
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

*/

const actionSkillsList = [
  new ActionSkill({
    id: "skill_001",
    rank: 1,
    name: "Basic Attack",
    typeSkill: "action",
    reach: "melee",
    text: "a basic attack",
    rarity: "common",
    typeDamage: "physical",
    damageMod: {
      pDmg: 1,
    },
    dotMod: {},
  }),
  new ActionSkill({
    id: "skill_002",
    rank: 1,
    name: "Sword Strike",
    typeSkill: "action",
    reach: "melee",
    text: "Dieee!!!",
    rarity: "common",
    typeDamage: "physical",
    damageMod: {
      pDmg: 1.1,
      maestry: 0.5,
    },
    dotMod: {},
  }),
  new ActionSkill({
    id: "skill_003",
    rank: 1,
    name: "Bleed",
    typeSkill: "action",
    reach: "melee",
    text: "put your enemy to bleed",
    rarity: "common",
    typeDamage: "physical",
    damageMod: {
      pDmg: 0.2,
    },
    dotMod: {
      pDmg: 0.9,
      duration: 5,
    },
  }),
];

export default actionSkillsList;
