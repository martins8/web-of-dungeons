import MobFactory from "src/game/factories/mobFactory";
import WeightedRNG from "src/game/rng/weightedRNG";
import SeedRNG from "src/game/rng/seedRNG";

export default class EncounterSystem {
  constructor(encounter, { rng } = {}) {
    this.encounter = encounter;
    this.rounds = encounter.rounds;
    this.pool = encounter.pool;

    this.rng = rng ?? new SeedRNG(Date.now());
    this.weightedRng = new WeightedRNG(this.rng);
  }

  generate() {
    const result = Array(this.rounds).fill(null);
    const appearances = {};

    // 1️⃣ Fixed rounds (boss, events, etc)
    for (const entry of this.pool) {
      if (entry.fixedRound) {
        const index = entry.fixedRound - 1;
        result[index] = entry.id;
        appearances[entry.id] = 1;
      }
    }

    // 2️⃣ Fill remaining rounds
    for (let i = 0; i < this.rounds; i++) {
      if (result[i]) continue;

      const candidates = this.pool.filter((entry) => {
        if (entry.fixedRound) return false;

        const used = appearances[entry.id] ?? 0;
        const max = entry.maxAppear ?? Infinity;

        return used < max && entry.weight > 0;
      });

      if (!candidates.length) {
        throw new Error("No valid mobs to fill encounter");
      }

      const picked = this.weightedRng.pick(candidates);

      result[i] = picked.id;
      appearances[picked.id] = (appearances[picked.id] ?? 0) + 1;
    }

    // 3️⃣ Resolve mobs
    return result.map((mobId) => MobFactory.fromMobId(mobId));
  }
}
