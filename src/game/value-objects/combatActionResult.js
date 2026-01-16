export default class CombatActionResult {
  constructor({
    attacker,
    defender,
    skill,
    typeDamage = null,
    damage = null,
    dot = null,
    hot = null,
    isCritical = false,
    isEvaded = false,
    isDead = false,
  }) {
    this.attacker = attacker;
    this.defender = defender;
    this.skill = skill;
    this.typeDamage = typeDamage;
    this.damage = damage;
    this.dot = dot;
    this.hot = hot;
    this.isCritical = isCritical;
    this.isEvaded = isEvaded;
    this.isDead = isDead;
  }
}
