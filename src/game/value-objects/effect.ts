import type { AttributeKey } from "./attributes";
import type { StatKey } from "./stats";

export type EffectType = "dot" | "hot" | "buff" | "debuff" | "cc";

export type EffectSubtype =
  | "bleed"
  | "poison"
  | "magical"
  | "stats"
  | "attribute"
  | "stun"
  | "silence"
  | "slow"
  | "rooted";

export type EffectTarget = "self" | "enemy";

export type EffectMechanic = "stack" | "refresh";

export type ScalingKey = AttributeKey | StatKey;

export interface EffectProps {
  id: string;
  target: EffectTarget;
  effectType: EffectType;
  mechanic: EffectMechanic;
  subtype?: EffectSubtype | null;
  scaling?: Partial<Record<ScalingKey, number>>;
  duration?: number | null;
  maxStack?: number | null;
  // allow extra metadata fields without strict typing
  [key: string]: unknown;
}

// need test file
export default class Effect {
  id: string;
  target: EffectTarget;
  effectType: EffectType;
  mechanic: EffectMechanic;
  subtype: EffectSubtype | null;
  scaling: Partial<Record<ScalingKey, number>>;
  duration: number | null;
  maxStack: number | null;

  constructor({
    id,
    target,
    effectType,
    mechanic,
    subtype = null,
    scaling = {},
    duration = null,
    maxStack = null,
  }: EffectProps) {
    this.id = id;
    this.target = target;
    this.effectType = effectType;
    this.mechanic = mechanic;
    this.subtype = subtype;
    this.scaling = scaling as Partial<Record<ScalingKey, number>>;
    this.duration = duration;
    this.maxStack = maxStack;
  }
}

/* 
effecttype = dot | hot | buff | debuff | cc
subtypes------ 
dot = bleed | poison | magical
hot = 
buff = stats | attribute 
debuff = stats | attribute 
cc = stun | silence | slow | rooted */

/**
 * stacking: {
 *   maxStacks
 * }
 */

