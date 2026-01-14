import CombatActionResult from "./combatActionResult";

export default class CombatResolve {
  //actions methods
  action(attacker, defender, skill, { rng, critSystem, evadeSystem }) {
    //evasion test
    const attackerCombatState = attacker.combatState;
    const defenderCombatState = defender.combatState;
    const isEvaded = evadeSystem.tryEvade(rng, defenderCombatState.stats.eva);
    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        typeDamage: skill.damage.typeDamage,
        damage: 0,
        isEvaded: true,
        isDead: false,
      });
    }

    //critical test
    const isCritical = critSystem.tryCrit(rng, attackerCombatState.stats.critC);

    //useActionSkill    remover attackerCombatState.stats   por outra coisa
    let damage = this.useSkill(skill, attackerCombatState.stats);

    if (isCritical) {
      damage = this.applyCrit(damage, attackerCombatState.stats.critD);
    }

    //defender apply your defense stats
    damage =
      skill.damage.typeDamage === "physical"
        ? this.applyDefense(damage, defenderCombatState.stats.pDef)
        : this.applyDefense(damage, defenderCombatState.stats.mDef);
    defenderCombatState.takeDamage(damage);

    return new CombatActionResult({
      attacker,
      defender,
      typeDamage: skill.damage.typeDamage,
      damage,
      isCritical,
      isEvaded: false,
      isDead: defenderCombatState.isDead(),
    });
  }

  useSkill(skill, baseStats) {
    let damage = 0;

    // percorre todos os modificadores definidos na skill
    for (const [key, mod] of Object.entries(skill.damage.scaling)) {
      const statValue = baseStats[key] || 0; // se não existir, assume 0
      damage += statValue * mod;
    }
    return damage * skill.rank; // aplica rank como multiplicador
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
