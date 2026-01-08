export default class Health {
  constructor(amount) {
    this._currentHp = Math.floor(amount);
    this._maxHp = Math.floor(amount);
  }

  get currentHp() {
    return this._currentHp;
  }
  get maxHp() {
    return this._maxHp;
  }

  takeDamage(amount) {
    this._currentHp = Math.max(0, this._currentHp - amount);
  }

  heal(amount) {
    this._currentHp = Math.min(this._maxHp, this._currentHp + amount);
  }

  increaseMaxHp(amount) {
    this._maxHp += amount;
  }

  isAlive() {
    return this._currentHp > 0;
  }
}
