export interface DotHotPayload {
  onAttacker: number;
  onDefender: number;
}

export type DeadByDotSide = "attacker" | "defender" | null;
export interface Events {
  type: string;
  payload: any;
}
export interface CombatActionResultParams {
  attacker: any;
  defender: any;
  skill: any;
  typeDamage?: string | null;
  damage?: number | null;
  heal?: number | null;
  dot?: DotHotPayload | null;
  hot?: DotHotPayload | null;
  isCritical?: boolean;
  isEvaded?: boolean;
  isDead?: boolean;
  isDraw?: boolean;
  isDeadByDot?: DeadByDotSide;
  events?: Events[];
}

export default class CombatActionResult {
  attacker: any;
  defender: any;
  skill: any;
  typeDamage: string | null;
  damage: number | null;
  heal: number | null;
  dot: DotHotPayload | null;
  hot: DotHotPayload | null;
  isCritical: boolean;
  isEvaded: boolean;
  isDead: boolean;
  isDraw: boolean;
  isDeadByDot: DeadByDotSide;
  events?: Events[];
  constructor({
    attacker,
    defender,
    skill,
    typeDamage = null,
    damage = null,
    heal = null,
    dot = null,
    hot = null,
    isCritical = false,
    isEvaded = false,
    isDead = false,
    isDraw = false,
    isDeadByDot = null,
  }: CombatActionResultParams) {
    this.attacker = attacker;
    this.defender = defender;
    this.skill = skill;
    this.typeDamage = typeDamage ?? null;
    this.damage = damage ?? null;
    this.heal = heal ?? null;
    this.dot = dot ?? null;
    this.hot = hot ?? null;
    this.isCritical = isCritical;
    this.isEvaded = isEvaded;
    this.isDead = isDead;
    this.isDraw = isDraw;
    this.isDeadByDot = isDeadByDot ?? null;
  }
}
