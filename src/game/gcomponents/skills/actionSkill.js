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
    let damage = 0;

    // percorre todos os modificadores definidos na skill
    for (const [key, mod] of Object.entries(this.damageMod)) {
      const statValue = baseStats[key] || 0; // se não existir, assume 0
      damage += statValue * mod;
    }
    return damage * this.rank; // aplica rank como multiplicador
  }
}
