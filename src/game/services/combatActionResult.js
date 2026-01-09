export default class CombatActionResult {
  constructor({
    attacker,
    defender,
    type,
    damage,
    isCritical = false,
    isEvaded = false,
    isDead = false,
  }) {
    this.attacker = attacker;
    this.defender = defender;
    this.type = type;
    this.damage = damage;
    this.isCritical = isCritical;
    this.isEvaded = isEvaded;
    this.isDead = isDead;
  }
}
