import type { RandomSource } from "./seedRNG";

interface CritSystemConfig {
  bonusPerFail: number;
  maxChance: number;
}

export default class CritSystem {
  private bonusPerFail: number;
  private maxChance: number;
  private currentBonus: number;

  constructor({ bonusPerFail, maxChance }: CritSystemConfig) {
    /*The base chance can be used in the future if there
    are any intrinsic combat bonuses, such as having an
    active dungeon passive or global buff.*/

    // this.baseChance = baseChance;
    this.bonusPerFail = bonusPerFail;
    this.maxChance = maxChance;
    this.currentBonus = 0;
  }

  tryCrit(rng: RandomSource, baseChanceFromStats: number): boolean {
    const finalChance = Math.min(
      baseChanceFromStats + this.currentBonus,
      this.maxChance,
    );

    const roll = rng.rollPercent();

    if (roll < finalChance) {
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

