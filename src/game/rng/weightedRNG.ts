import type { RandomSource } from "./seedRNG";

export interface WeightedEntry {
  weight: number;
  // allow extra metadata fields without strict typing (e.g. id)
  [key: string]: unknown;
}

/**
 * Simple weighted RNG helper that picks an entry based on its weight.
 * Expects a RNG implementation compatible with `RandomSource`.
 */
export default class WeightedRNG {
  private rng: RandomSource;

  constructor(rng: RandomSource) {
    this.rng = rng;
  }

  pick<T extends WeightedEntry>(entries: T[]): T {
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


