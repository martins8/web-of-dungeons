export default class Gold {
  constructor(amount = 0) {
    this.amount = amount;
  }

  add(value) {
    this.amount += value;
  }

  spend(value) {
    if (value > this.amount) throw new Error("Not enough gold");
    this.amount -= value;
  }
}
