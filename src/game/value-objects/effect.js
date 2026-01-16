// need test file
export default class Effect {
  constructor({
    target,
    effectType,
    subtype = null,
    scaling = {},
    duration = null,
  }) {
    this.target = target;
    this.effectType = effectType;
    this.subtype = subtype;
    this.scaling = scaling;
    this.duration = duration;
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
