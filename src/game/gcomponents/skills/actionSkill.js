import Skill from "./skill";

export default class ActionSkill extends Skill {
  constructor({
    id,
    rank,
    name,
    typeSkill,
    reach,
    text,
    rarity,
    typeDamage,
    damageMod,
    dotMod,
  }) {
    super({ id, rank, name, typeSkill, reach, text, rarity });
    this.typeDamage = typeDamage;
    this.damageMod = damageMod;
    this.dotMod = dotMod;
  }

  useActionSkill(baseStats) {
    const damage =
      this.typeDamage === "physical"
        ? baseStats.pDmg * this.damageMod.pDmg
        : baseStats.mDmg * this.damageMod.mDmg;
    return damage;
  }
}
