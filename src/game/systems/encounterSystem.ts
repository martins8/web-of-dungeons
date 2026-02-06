import MobFactory from "src/game/factories/mobFactory";
import WeightedRNG, {
  type WeightedEntry,
} from "src/game/rng/weightedRNG";
import SeedRNG, { type RandomSource } from "src/game/rng/seedRNG";

export interface EncounterPoolEntry extends WeightedEntry {
  id: string;
  maxAppear?: number;
  fixedRound?: number;
}

export interface EncounterDefinition {
  type: string;
  rounds: number;
  pool: EncounterPoolEntry[];
}

export interface EncounterSystemOptions {
  rng?: RandomSource;
}

export default class EncounterSystem {
  encounter: EncounterDefinition;
  rounds: number;
  pool: EncounterPoolEntry[];
  rng: RandomSource;
  weightedRng: WeightedRNG;

  constructor(
    encounter: EncounterDefinition,
    { rng }: EncounterSystemOptions = {},
  ) {
    this.encounter = encounter;
    this.rounds = encounter.rounds;
    this.pool = encounter.pool;

    this.rng = rng ?? new SeedRNG(Date.now());
    this.weightedRng = new WeightedRNG(this.rng);
  }

  generate() {
    const result: Array<string | null> = Array(this.rounds).fill(null);
    const appearances: Record<string, number> = {};

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

      result[i] = picked.id as string;
      appearances[picked.id as string] = (appearances[picked.id as string] ?? 0) + 1;
    }

    // 3️⃣ Resolve mobs
    return result.map((mobId) => MobFactory.fromMobId(mobId as string));
  }
}

