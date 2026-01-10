export default class SeedRNG {
  //seed = Date.now()   param example to singleplayer
  constructor(seed) {
    if (seed === undefined) {
      throw new Error("RNG requires an explicit seed");
    }
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  rollPercent() {
    return this.next() * 100;
  }
}
