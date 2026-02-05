import LevelCalculator from "../services/levelCalculator";

export default class Experience {
  constructor(xp = 0) {
    this.xp = xp;
  }

  gain(amount) {
    this.xp += amount;
  }

  get level() {
    return LevelCalculator.fromXP(this.xp);
  }
}
