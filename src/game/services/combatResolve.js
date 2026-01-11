import CombatActionResult from "./combatActionResult";

export default class CombatResolve {
  //actions methods
  action(attacker, defender, skill, { rng, critSystem, evadeSystem }) {
    //evasion test
    const isEvaded = evadeSystem.tryEvade(rng, defender.stats.eva);
    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        typeDamage: skill.typeDamage,
        damage: 0,
        isEvaded: true,
        isDead: false,
      });
    }

    //critical test
    const isCritical = critSystem.tryCrit(rng, attacker.stats.critC);

    //useActionSkill
    let damage = skill.useActionSkill(attacker.stats);
    if (isCritical) {
      damage = this.applyCrit(damage, attacker.stats.critD);
    }

    //defender apply your defense stats
    damage =
      skill.typeDamage === "physical"
        ? this.applyDefense(damage, defender.stats.pDef)
        : this.applyDefense(damage, defender.stats.mDef);
    defender.takeDamage(damage);

    return new CombatActionResult({
      attacker,
      defender,
      typeDamage: skill.typeDamage,
      damage,
      isCritical,
      isEvaded: false,
      isDead: defender.isDead(),
    });
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
