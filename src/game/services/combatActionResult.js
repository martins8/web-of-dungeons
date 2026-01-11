export default class CombatActionResult {
  constructor({
    attacker,
    defender,
    typeDamage,
    damage,
    isCritical = false,
    isEvaded = false,
    isDead = false,
  }) {
    this.attacker = attacker;
    this.defender = defender;
    this.typeDamage = typeDamage;
    this.damage = damage;
    this.isCritical = isCritical;
    this.isEvaded = isEvaded;
    this.isDead = isDead;
  }
}
