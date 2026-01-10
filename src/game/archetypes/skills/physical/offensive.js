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

const offensiveSkills = [
  {
    rank: 1,
    name: "Bleed",
    type: "physical",
    reach: "melee",
    text: "put your enemy to bleed",
    rarity: "common",
    damageMod: {
      pDmg: 0.2,
    },
    dotMod: {
      pDmg: 0.8,
    },
  },
  {
    rank: 1,
    name: "Sword Strike",
    type: "physical",
    reach: "melee",
    text: "Dieee!!!",
    rarity: "common",
    damageMod: {
      pDmg: 1.1,
      maestry: 0.5,
    },
    dotMod: {},
  },
];

export default offensiveSkills;
