import CombatActionResult from "./combatActionResult";

export default class CombatResolve {
  //actions methods
  physical(attacker, defender) {
    //evasion test
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

    //critical test
    const isCritical = this.rollCrit(attacker.stats.critC);
    let damage = attacker.stats.pDmg;
    if (isCritical) {
      damage = this.applyCrit(damage, attacker.stats.critD);
    }

    //defender apply your defense stats
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

  //suport methods
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
    if (defense >= 0) {
      return Math.floor(damage * (100 / (100 + defense)));
    }

    // opcional: suporte a defesa negativa
    return Math.floor(damage * (2 - 100 / (100 - defense)));
  }
}
