import LevelCalculator from "../services/levelCalculator";

export default class Experience {
  xp: number;

  constructor(xp: number = 0) {
    this.xp = xp;
  }

  gain(amount: number): void {
    this.xp += amount;
  }

  get level(): number {
    return LevelCalculator.fromXP(this.xp);
  }
}

