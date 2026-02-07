import LevelCalculator from "../services/levelCalculator";

export default class Experience {
  amount: number;

  constructor(amount: number = 0) {
    this.amount = amount;
  }

  public gain(amount: number): void {
    this.amount += amount;
  }

  get level(): number {
    return LevelCalculator.fromXP(this.amount);
  }
}
