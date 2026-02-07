import CombatActionResult from "../value-objects/combatActionResult";
import type Skill from "../value-objects/skill";
import type CombatState from "../gcomponents/combatState";
import type { StatsProps } from "../value-objects/stats";
import type { RandomSource } from "../rng/seedRNG";
import type CritSystem from "../rng/critSystem";
import type EvadeSystem from "../rng/evadeSystem";

export interface CombatEntity {
  combatState: CombatState;
  critSystem: CritSystem;
  evadeSystem: EvadeSystem;
  [key: string]: any;
}

export interface CombatResolveDeps {
  rng: RandomSource;
  critSystem: CritSystem;
  evadeSystem: EvadeSystem;
}

/**
 * CombatResolve contains the deterministic logic that computes the result
 * of a single skill execution: evasion, crit, damage calculation, defense
 * application and applying the computed damage to the defender.
 */
export default class CombatResolve {
  action(
    attacker: CombatEntity,
    defender: CombatEntity,
    skill: Skill,
    ticked: boolean,
    effectSystem: any,
    { rng, critSystem, evadeSystem }: CombatResolveDeps,
  ): CombatActionResult {
    let effectTarget: CombatState | undefined;
    if (skill.effects) {
      effectTarget =
        (skill.effects as any).target === "self"
          ? attacker.combatState
          : defender.combatState;
      // buff and debuff are applied before resolve
      if (effectSystem?.isBuff() || effectSystem?.isDebuff()) {
        effectSystem.apply(effectTarget);
      }
    }

    const attackerCombatState = attacker.combatState;
    const defenderCombatState = defender.combatState;

    // if skill has heal
    let heal = 0;
    if (skill.heal) {
      heal = this.useSkill(
        skill,
        attackerCombatState.getEffectiveStats(),
        "heal",
      );
    }
    attackerCombatState.heal(heal);

    // 2️⃣ Evasion test
    const isEvaded = evadeSystem.tryEvade(
      rng,
      defenderCombatState.getEffectiveStats().eva,
    );

    // offensive skills just apply effect if isEvaded false
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

    // check if any combatant die for ticks before skill resolve.
    if (attackerCombatState.isDead() || defenderCombatState.isDead()) {
      let whoDie: "attacker" | "defender" | null = null;
      const draw =
        attackerCombatState.isDead() && defenderCombatState.isDead();
      if (!draw) {
        whoDie = attackerCombatState.isDead() ? "attacker" : "defender";
      }
      return new CombatActionResult({
        attacker,
        defender,
        skill,
        typeDamage: skill.damage?.typeDamage ?? null,
        damage: 0,
        heal: heal,
        dot: {
          onAttacker: damageAndHealTicked.attackerDotHot.damage,
          onDefender: damageAndHealTicked.defenderDotHot.damage,
        },
        hot: {
          onAttacker: damageAndHealTicked.attackerDotHot.heal,
          onDefender: damageAndHealTicked.defenderDotHot.heal,
        },
        isCritical: false,
        isEvaded: false,
        isDead: true,
        isDraw: draw === true ? draw : false,
        isDeadByDot: whoDie,
      });
    }

    if (isEvaded) {
      return new CombatActionResult({
        attacker,
        defender,
        skill,
        typeDamage: skill.damage?.typeDamage ?? null,
        heal: heal,
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
    let damage = 0;
    if (skill.damage) {
      damage = this.useSkill(
        skill,
        attackerCombatState.getEffectiveStats(),
        "damage",
      );
    }

    if (isCritical) {
      damage = this.applyCrit(
        damage,
        attackerCombatState.getEffectiveStats().critD,
      );
    }

    // 5️⃣ Defense application
    if (damage > 0 && skill.damage) {
      const defense =
        skill.damage.typeDamage === "physical"
          ? defenderCombatState.getEffectiveStats().pDef
          : defenderCombatState.getEffectiveStats().mDef;

      damage = this.applyDefense(damage, defense);
    }
    defenderCombatState.takeDamage(damage);

    // 6️⃣ Result
    return new CombatActionResult({
      attacker,
      defender,
      skill,
      typeDamage: skill.damage?.typeDamage ?? null,
      damage,
      heal: heal,
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

  private useSkill(
    skill: Skill,
    baseStats: StatsProps,
    prop: "heal" | "damage",
  ): number {
    let value = 0;

    const scaling = (skill as any)[prop]?.scaling as
      | Partial<Record<keyof StatsProps, number>>
      | undefined;
    if (!scaling) return 0;

    for (const [key, mod] of Object.entries(scaling)) {
      value += ((baseStats as any)[key] || 0) * (mod as number);
    }

    return value * skill.rank;
  }

  private applyCrit(baseDamage: number, critDamage: number): number {
    return Math.floor(baseDamage * (1 + critDamage / 100));
  }

  private applyDefense(damage: number, defense: number): number {
    if (defense >= 0) {
      return Math.floor(damage * (100 / (100 + defense)));
    }
    return Math.floor(damage * (2 - 100 / (100 - defense)));
  }

  private getDamageAndHealTicked(
    attacker: CombatEntity,
    defender: CombatEntity,
    ticked: boolean,
  ): {
    attackerDotHot: { damage: number; heal: number };
    defenderDotHot: { damage: number; heal: number };
  } {
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

