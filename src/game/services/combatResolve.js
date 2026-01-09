import CombatActionResult from "./combatActionResult";

export default class CombatResolve {
  physical(attacker, defender) {
    const isEvaded = this.rollEvade(defender.stats.eva);

    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        type: "physical",
        damage: 0,
        isEvaded: true,
        isDead: false,
      });
    }

    const isCritical = this.rollCrit(attacker.stats.critC);
    let damage = attacker.stats.pDmg;

    if (isCritical) {
      damage = this.applyCrit(damage, attacker.stats.critD);
    }

    damage = this.applyDefense(damage, defender.stats.pDef);

    defender.takeDamage(damage);

    return new CombatActionResult({
      attacker,
      defender,
      type: "physical",
      damage,
      isCritical,
      isEvaded: false,
      isDead: defender.isDead(),
    });
  }

  rollCrit(chance) {
    return Math.random() * 100 < chance;
  }

  rollEvade(chance) {
    return Math.random() * 100 < chance;
  }

  applyCrit(baseDamage, critDamage) {
    return Math.floor(baseDamage * (1 + critDamage / 100));
  }

  applyDefense(damage, defense) {
    const reduction = Math.floor(defense * 0.3);
    return Math.max(0, damage - reduction);
  }
}
