export default class EffectSystem {
  constructor(effect) {
    this.effect = effect;
  }

  isBuff() {
    return this.effect.effectType === "buff";
  }

  isDebuff() {
    return this.effect.effectType === "debuff";
  }

  isDot() {
    return this.effect.effectType === "dot";
  }

  isHot() {
    return this.effect.effectType === "hot";
  }

  isCC() {
    return this.effect.effectType === "cc";
  }

  apply(combatState) {
    if (this.isBuff() || this.isHot()) {
      combatState.addBuff(this.effect);
    }

    if (this.isDebuff() || this.isDot()) {
      combatState.addDebuff(this.effect);
    }

    if (this.isCC()) {
      combatState.applyCC(this.effect.subtype);
    }
  }

  tick(combatState) {
    if (this.isDot()) {
      const damage = this.calculateScaling(combatState.getEffectiveStats());
      combatState.takeDamage(damage);
    }

    if (this.isHot()) {
      const heal = this.calculateScaling(combatState.getEffectiveStats());
      combatState.heal(heal);
    }
  }

  calculateScaling(stats) {
    let value = 0;

    for (const [key, mod] of Object.entries(this.effect.scaling)) {
      value += (stats[key] || 0) * mod;
    }

    return Math.floor(value);
  }
}

/*
effecttype = dot | hot | buff | debuff

subtypes------
dot = bleed | poison | magical
hot = 
buff = stats | attribute
debuff = stats | attribute
cc = stun | silence | slow | rooted
*/
