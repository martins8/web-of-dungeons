import CombatActionResult from "../value-objects/combatActionResult";

export default class CombatResolve {
  //actions methods
  action(attacker, defender, skill, ticked, { rng, critSystem, evadeSystem }) {
    //tick damage if ticked is true
    const damageAndHealTicked = this.getDamageAndHealTicked(
      attacker,
      defender,
      ticked,
    );
    //catch combat states
    const attackerCombatState = attacker.combatState;
    const defenderCombatState = defender.combatState;
    //evasion test
    const isEvaded = evadeSystem.tryEvade(
      rng,
      defenderCombatState.getEffectiveStats().eva,
    );
    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        skill,
        typeDamage: skill.damage.typeDamage,
        damage: 0,
        dot: {
          onAttacker: damageAndHealTicked.attackerDotHot.damage,
          onDefender: damageAndHealTicked.defenderDotHot.damage,
        },
        hot: {
          onAttacker: damageAndHealTicked.attackerDotHot.heal,
          onDefender: damageAndHealTicked.defenderDotHot.heal,
        },
        isCritical: false,
        isEvaded: true,
        isDead: false,
      });
    }
    //critical test
    const isCritical = critSystem.tryCrit(
      rng,
      attackerCombatState.getEffectiveStats().critC,
    );
    //useActionSkill
    let damage = this.useSkill(skill, attackerCombatState.getEffectiveStats());

    if (isCritical) {
      damage = this.applyCrit(
        damage,
        attackerCombatState.getEffectiveStats().critD,
      );
    }
    //defender apply your defense stats
    damage =
      skill.damage.typeDamage === "physical"
        ? this.applyDefense(
            damage,
            defenderCombatState.getEffectiveStats().pDef,
          )
        : this.applyDefense(
            damage,
            defenderCombatState.getEffectiveStats().mDef,
          );
    defenderCombatState.takeDamage(damage);

    return new CombatActionResult({
      attacker,
      defender,
      skill,
      typeDamage: skill.damage.typeDamage,
      damage,
      dot: {
        onAttacker: damageAndHealTicked.attackerDotHot.damage,
        onDefender: damageAndHealTicked.defenderDotHot.damage,
      },
      hot: {
        onAttacker: damageAndHealTicked.attackerDotHot.heal,
        onDefender: damageAndHealTicked.defenderDotHot.heal,
      },
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

  getDamageAndHealTicked(attacker, defender, ticked) {
    let attackerDotHot;
    let defenderDotHot;
    if (ticked) {
      attackerDotHot = attacker.combatState.tickEffectsDamageAndHeal();
      defenderDotHot = defender.combatState.tickEffectsDamageAndHeal();
    } else {
      attackerDotHot = { damage: 0, heal: 0 };
      defenderDotHot = { damage: 0, heal: 0 };
    }
    return {
      attackerDotHot: {
        damage: attackerDotHot.damage > 0 ? attackerDotHot.damage : 0,
        heal: attackerDotHot.heal > 0 ? attackerDotHot.heal : 0,
      },
      defenderDotHot: {
        damage: defenderDotHot.damage > 0 ? defenderDotHot.damage : 0,
        heal: defenderDotHot.heal > 0 ? defenderDotHot.heal : 0,
      },
    };
  }
}
