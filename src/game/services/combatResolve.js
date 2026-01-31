import CombatActionResult from "../value-objects/combatActionResult";

/**
 * CombatResolve contains the deterministic logic that computes the result
 * of a single skill execution: evasion, crit, damage calculation, defense
 * application and applying the computed damage to the defender.
 */
export default class CombatResolve {
  action(
    attacker,
    defender,
    skill,
    ticked,
    effectSystem,
    { rng, critSystem, evadeSystem },
  ) {
    let effectTarget;
    if (skill.effects) {
      effectTarget =
        skill.effects.target === "self"
          ? attacker.combatState
          : defender.combatState;
      //buff and debuff are aplied before resolve
      if (effectSystem?.isBuff() || effectSystem?.isDebuff()) {
        effectSystem.apply(effectTarget);
      }
    }

    const attackerCombatState = attacker.combatState;
    const defenderCombatState = defender.combatState;

    // 2️⃣ Evasion test
    const isEvaded = evadeSystem.tryEvade(
      rng,
      defenderCombatState.getEffectiveStats().eva,
    );

    //offensive skills just apply effect if isEvaded false
    if (
      (skill.effects && !isEvaded && effectSystem?.isDot()) ||
      effectSystem?.isHot()
    ) {
      effectSystem.apply(effectTarget);
    }

    // 1️⃣ Tick DOT / HOT (one time per turn)
    const damageAndHealTicked = this.getDamageAndHealTicked(
      attacker,
      defender,
      ticked,
    );

    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        skill,
        typeDamage: skill.damage.typeDamage,
        damage: 0,
        dot:
          damageAndHealTicked.attackerDotHot.damage ||
          damageAndHealTicked.defenderDotHot.damage
            ? {
                onAttacker: damageAndHealTicked.attackerDotHot.damage,
                onDefender: damageAndHealTicked.defenderDotHot.damage,
              }
            : null,
        hot:
          damageAndHealTicked.attackerDotHot.heal ||
          damageAndHealTicked.defenderDotHot.heal
            ? {
                onAttacker: damageAndHealTicked.attackerDotHot.heal,
                onDefender: damageAndHealTicked.defenderDotHot.heal,
              }
            : null,
        isCritical: false,
        isEvaded: true,
        isDead: false,
      });
    }

    // 3️⃣ Crit test
    const isCritical = critSystem.tryCrit(
      rng,
      attackerCombatState.getEffectiveStats().critC,
    );

    // 4️⃣ Get skill base damage
    let damage = this.useSkill(skill, attackerCombatState.getEffectiveStats());

    if (isCritical) {
      damage = this.applyCrit(
        damage,
        attackerCombatState.getEffectiveStats().critD,
      );
    }

    // 5️⃣ Defense application
    const defense =
      skill.damage.typeDamage === "physical"
        ? defenderCombatState.getEffectiveStats().pDef
        : defenderCombatState.getEffectiveStats().mDef;

    damage = this.applyDefense(damage, defense);

    defenderCombatState.takeDamage(damage);

    // 6️⃣ Result
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

  // =========================
  // Helpers
  // =========================

  useSkill(skill, baseStats) {
    let damage = 0;

    for (const [key, mod] of Object.entries(skill.damage.scaling)) {
      damage += (baseStats[key] || 0) * mod;
    }

    return damage * skill.rank;
  }

  applyCrit(baseDamage, critDamage) {
    return Math.floor(baseDamage * (1 + critDamage / 100));
  }

  applyDefense(damage, defense) {
    if (defense >= 0) {
      return Math.floor(damage * (100 / (100 + defense)));
    }
    return Math.floor(damage * (2 - 100 / (100 - defense)));
  }

  getDamageAndHealTicked(attacker, defender, ticked) {
    if (!ticked) {
      return {
        attackerDotHot: { damage: 0, heal: 0 },
        defenderDotHot: { damage: 0, heal: 0 },
      };
    }

    return {
      attackerDotHot: attacker.combatState.tickEffectsDamageAndHeal(
        defender.combatState.getEffectiveStats(),
      ),
      defenderDotHot: defender.combatState.tickEffectsDamageAndHeal(
        attacker.combatState.getEffectiveStats(),
      ),
    };
  }
}
