export default class Skill {
  /**
   * Represents a skill usable in combat.
   * @param {object} params
   * @param {string} params.id
   * @param {number} params.rank
   * @param {string} params.typeSkill - e.g. 'action' | 'buff'
   * @param {number} params.reach - target reach / distance
   * @param {number} params.cooldown - turn cooldown
   * @param {object|null} params.heal - brute heal definition or null
   * @param {object|null} params.damage - damage definition or null
   * @param {object} params.effects - effect payload
   * @param {object} params.metadata - human-readable metadata (name, desc)
   */
  constructor({
    id,
    rank,
    typeSkill,
    reach,
    cooldown,
    heal = null,
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
    this.heal = heal;
    this.effects = effects;
    this.metadata = metadata;
  }

  get name() {
    return this.metadata.name;
  }
}
