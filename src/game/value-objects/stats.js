export default class Stats {
  constructor({
    pDmg,
    mDmg,
    pDef,
    mDef,
    critC,
    critD,
    eva,
    luck,
    init,
    speed,
    maxHp,
    hPower,
  }) {
    this.pDmg = pDmg;
    this.mDmg = mDmg;
    this.pDef = pDef;
    this.mDef = mDef;
    this.critC = critC;
    this.critD = critD;
    this.eva = eva;
    this.luck = luck;
    this.init = init;
    this.speed = speed;
    this.maxHp = maxHp;
    this.hPower = hPower;
  }
}
