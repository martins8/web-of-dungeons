export default class Health {
  private _currentHp: number;
  private _maxHp: number;

  constructor(amount: number) {
    const base = Math.floor(amount);
    this._currentHp = base;
    this._maxHp = base;
  }

  get currentHp(): number {
    return this._currentHp;
  }

  get maxHp(): number {
    return this._maxHp;
  }

  takeDamage(amount: number): void {
    this._currentHp = Math.max(0, this._currentHp - amount);
  }

  heal(amount: number): void {
    this._currentHp = Math.min(this._maxHp, this._currentHp + amount);
  }

  increaseMaxHp(amount: number): void {
    this._maxHp += amount;
  }

  isAlive(): boolean {
    return this._currentHp > 0;
  }
}

