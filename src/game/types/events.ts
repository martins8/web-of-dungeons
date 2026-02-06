export interface AttackPayload {
  source: string | { name: string };
  target: string | { name: string };
  damage: number;
  isCritical: boolean;
  damageType: "physical" | "magical" | string;
}

export interface HealPayload {
  source: string | { name: string };
  heal: number;
}

export interface SimpleTargetPayload {
  target: string | { name: string };
}

export interface DotHotPayload {
  target: string | { name: string };
  amount: number;
}

export interface DrawPayload {
  source: string | { name: string };
  target: string | { name: string };
}

export type EventPayload =
  | AttackPayload
  | HealPayload
  | SimpleTargetPayload
  | DotHotPayload
  | DrawPayload
  | any;

export type CombatEventType =
  | "ATTACK"
  | "HEAL"
  | "EVADE"
  | "DOT_TICK"
  | "HOT_TICK"
  | "DEATH"
  | "DEATH_BY_DOT"
  | "DRAW";

export interface CombatEvent {
  type: CombatEventType;
  payload: EventPayload;
}
