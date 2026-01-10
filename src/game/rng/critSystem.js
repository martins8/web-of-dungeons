export default class CritSystem {
  constructor({ baseChance, bonusPerFail, maxChance }) {
    /*The base chance can be used in the future if there
    are any intrinsic combat bonuses, such as having an
    active dungeon passive or global buff.*/

    //this.baseChance = baseChance;
    this.bonusPerFail = bonusPerFail;
    this.maxChance = maxChance;
    this.currentBonus = 0;
  }

  tryCrit(rng, baseChanceFromStats) {
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

  reset() {
    this.currentBonus = 0;
  }
}
