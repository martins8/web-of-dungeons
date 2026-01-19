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

*/

const magicalSkillsList = [
  new Skill({
    id: "skill_005",
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
];

export default magicalSkillsList;
