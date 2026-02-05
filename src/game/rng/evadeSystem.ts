import type { RandomSource } from "./seedRNG";

interface EvadeSystemConfig {
  bonusPerFail: number;
  maxChance: number;
}

export default class EvadeSystem {
  private bonusPerFail: number;
  private maxChance: number;
  private currentBonus: number;

  constructor({ bonusPerFail, maxChance }: EvadeSystemConfig) {
    /*The base chance can be used in the future if there
    are any intrinsic combat bonuses, such as having an
    active dungeon passive or global buff.*/

    // this.baseChance = baseChance;
    this.bonusPerFail = bonusPerFail;
    this.maxChance = maxChance;
    this.currentBonus = 0;
  }

  tryEvade(rng: RandomSource, baseChanceFromStats: number): boolean {
    const chance = Math.min(
      baseChanceFromStats + this.currentBonus,
      this.maxChance,
    );

    const roll = rng.rollPercent();

    if (roll < chance) {
      this.currentBonus = 0;
      return true;
    }

    this.currentBonus += this.bonusPerFail;
    return false;
  }

  reset(): void {
    this.currentBonus = 0;
  }
}

