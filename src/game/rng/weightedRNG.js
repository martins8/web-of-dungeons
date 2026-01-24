/**
 * SeedRNG contract
 * next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  rollPercent() {
    return this.next() * 100;
  }
 */

export default class WeightedRNG {
  constructor(rng) {
    this.rng = rng;
  }

  pick(entries) {
    const valid = entries.filter((e) => e.weight > 0);

    if (valid.length === 0) {
      throw new Error("No entries with weight > 0");
    }

    const totalWeight = valid.reduce((sum, e) => sum + e.weight, 0);
    const roll = this.rng.next() * totalWeight;

    let acc = 0;
    for (const entry of valid) {
      acc += entry.weight;
      if (roll <= acc) return entry;
    }

    return valid[valid.length - 1];
  }
}
