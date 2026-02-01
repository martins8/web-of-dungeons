export default class CombatActionResult {
  constructor({
    attacker,
    defender,
    skill,
    typeDamage = null,
    damage = null,
    heal = null,
    dot = {},
    hot = {},
    isCritical = false,
    isEvaded = false,
    isDead = false,
  }) {
    this.attacker = attacker;
    this.defender = defender;
    this.skill = skill;
    this.typeDamage = typeDamage;
    this.damage = damage;
    this.heal = heal;
    this.dot = dot;
    this.hot = hot;
    this.isCritical = isCritical;
    this.isEvaded = isEvaded;
    this.isDead = isDead;
  }
}
