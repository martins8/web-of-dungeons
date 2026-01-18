import CombatActionResult from "../value-objects/combatActionResult";

export default class CombatResolve {
  action(attacker, defender, skill, ticked, { rng, critSystem, evadeSystem }) {
    // 1️⃣ Tick DOT / HOT (one time per turn)
    const damageAndHealTicked = this.getDamageAndHealTicked(
      attacker,
      defender,
      ticked,
    );

    const attackerCombatState = attacker.combatState;
    const defenderCombatState = defender.combatState;

    // 2️⃣ Evasion test
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
