export default class Gold {
  amount: number;

  constructor(amount: number = 0) {
    this.amount = amount;
  }

  add(value: number): void {
    this.amount += value;
  }

  spend(value: number): void {
    if (value > this.amount) throw new Error("Not enough gold");
    this.amount -= value;
  }
}

