export interface RandomSource {
  next(): number;
  rollPercent(): number;
}

export default class SeedRNG implements RandomSource {
  // seed = Date.now()   param example to singleplayer
  seed: number;

  constructor(seed: number) {
    if (seed === undefined) {
      throw new Error("RNG requires an explicit seed");
    }
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  rollPercent(): number {
    return this.next() * 100;
  }
}

