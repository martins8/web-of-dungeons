// need test file
export default class Effect {
  constructor({
    id,
    target,
    effectType,
    mechanic,
    subtype = null,
    scaling = {},
    duration = null,
    maxStack = null,
  }) {
    this.id = id;
    this.target = target;
    this.effectType = effectType;
    this.mechanic = mechanic;
    this.subtype = subtype;
    this.scaling = scaling;
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
