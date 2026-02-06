export interface StatsProps {
  pDmg: number;
  mDmg: number;
  pDef: number;
  mDef: number;
  critC: number;
  critD: number;
  eva: number;
  luck: number;
  init: number;
  speed: number;
  maxHp: number;
  hPower: number;
  maestry: number;
}

export type StatKey = keyof StatsProps;

export default class Stats implements StatsProps {
  pDmg: number;
  mDmg: number;
  pDef: number;
  mDef: number;
  critC: number;
  critD: number;
  eva: number;
  luck: number;
  init: number;
  speed: number;
  maxHp: number;
  hPower: number;
  maestry: number;

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
    maestry,
  }: StatsProps) {
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
    this.maestry = maestry;
  }
}

