import type Effect from "src/game/value-objects/effect";
import type CombatState from "src/game/gcomponents/combatState";
import type { StatsProps } from "src/game/value-objects/stats";

/**
 * EffectSystem models a single effect (buff / debuff / dot / hot / cc)
 * and provides helpers to apply and tick that effect against a
 * `CombatState` instance.
 */
export default class EffectSystem {
  effect: Effect;

  constructor(effect: Effect) {
    this.effect = effect;
  }

  private hasType(type: string): boolean {
    return (this.effect as any).effectType === type;
  }

  /** Returns true when effect is a buff (applied to self stats) */
  isBuff(): boolean {
    return this.hasType("buff");
  }

  isDebuff(): boolean {
    return this.hasType("debuff");
  }

  isDot(): boolean {
    return this.hasType("dot");
  }

  isHot(): boolean {
    return this.hasType("hot");
  }

  isCC(): boolean {
    return this.hasType("cc");
  }

  isRefresh(): boolean {
    return (this.effect as any).mechanic === "refresh";
  }

  apply(combatState: CombatState): void {
    if (this.isBuff() || this.isHot()) {
      combatState.addBuff(this.effect as any);
    }

    if (this.isDebuff() || this.isDot()) {
      combatState.addDebuff(this.effect as any);
    }

    if (this.isCC()) {
      combatState.applyCC((this.effect as any).subtype as any);
    }
  }

  /* 
  ACTUALLY TICKS CONSIDER DYNAMIC STATS IN THE FUTURE WE WILL PUT THE STATS SNAPSHOT WHEN apply() called in combat orchestrator
  */
  tick(selfCombatState: CombatState, targetCombatStats: StatsProps): number {
    if (this.isDot()) {
      const damage = this.calculateScaling(targetCombatStats);
      // combatState.takeDamage(damage);
      return damage;
    }

    if (this.isHot()) {
      const heal = this.calculateScaling(selfCombatState.getEffectiveStats());
      // combatState.heal(heal);
      return heal;
    }

    return 0;
  }

  calculateScaling(stats: StatsProps): number {
    let value = 0;

    const scaling = (this.effect as any).scaling as
      | Record<string, number>
      | undefined;

    if (!scaling) {
      return 0;
    }

    for (const [key, mod] of Object.entries(scaling)) {
      value += ((stats as any)[key] || 0) * (mod as number);
    }

    const floored = Math.floor(value);
    return floored === 0 ? 1 : floored;
  }
}

/*
effecttype = dot | hot | buff | debuff

subtypes------
dot = bleed | poison | magical
hot = 
buff = stats | attribute
debuff = stats | attribute
cc = stun | silence | slow | rooted
*/

