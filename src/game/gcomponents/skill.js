export default class Skill {
  constructor({
    id,
    rank,
    typeSkill,
    reach,
    cooldown,
    damage = null,
    effects = {},
    metadata,
  }) {
    this.id = id;
    this.rank = rank;
    this.typeSkill = typeSkill;
    this.reach = reach;
    this.cooldown = cooldown;
    this.damage = damage;
    this.effects = effects;
    this.metadata = metadata;
  }
}
