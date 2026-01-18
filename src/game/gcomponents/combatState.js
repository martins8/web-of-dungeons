import StatsCalculator from "src/game/services/statsCalculator";
import EffectSystem from "src/game/systems/effectSystem";

export default class CombatState {
  constructor(stats, attributes) {
    this.baseStats = stats;
    this.baseAttributes = attributes;

    this.currentHp = stats.maxHp;

    this.buffs = [];
    this.debuffs = [];

    this.cc = {
      stunned: false,
      silenced: false,
      rooted: false,
      slowed: false,
    };

    this.cooldowns = new Map();
  }

  /* ---------------- HP ---------------- */

  takeDamage(amount) {
    this.currentHp = Math.max(0, this.currentHp - amount);
    return amount;
  }

  heal(amount) {
    this.currentHp = Math.min(
      this.getEffectiveStats().maxHp,
      this.currentHp + amount,
    );
    return amount;
  }

  isDead() {
    return this.currentHp <= 0;
  }

  /* ---------------- EFFECTS ---------------- */

  addBuff(effect) {
    this.buffs.push(this.cloneEffect(effect));
  }

  addDebuff(effect) {
    this.debuffs.push(this.cloneEffect(effect));
  }

  cloneEffect(effect) {
    return {
      effectType: effect.effectType,
      subtype: effect.subtype,
      scaling: { ...effect.scaling },
      duration: effect.duration,
    };
  }

  applyCC(type) {
    this.cc[type] = true;
  }

  clearCC() {
    Object.keys(this.cc).forEach((k) => (this.cc[k] = false));
  }

  /* ---------------- EFFECTIVE ATTRIBUTES ---------------- */

  getEffectiveAttributes() {
    let attrs = this.baseAttributes;

    [...this.buffs, ...this.debuffs].forEach((effect) => {
      if (effect.subtype === "attribute") {
        for (const [attr, value] of Object.entries(effect.scaling)) {
          attrs = attrs.increase(attr, value);
        }
      }
    });

    return attrs;
  }

  /* ---------------- EFFECTIVE STATS ---------------- */

  getEffectiveStats() {
    let stats = StatsCalculator.calculate(this.getEffectiveAttributes());

    [...this.buffs, ...this.debuffs].forEach((effect) => {
      if (effect.subtype === "stats") {
        for (const [key, value] of Object.entries(effect.scaling)) {
          stats[key] += value;
        }
      }
    });

    return stats;
  }

  /* ---------------- TICK ---------------- */
  //tick timers for buffs, debuffs, and crowd controll effects
  tickEffects() {
    this.clearCC();

    const allEffects = [...this.buffs, ...this.debuffs];

    allEffects.forEach((effect) => {
      const system = new EffectSystem(effect);
      effect.duration -= 1;

      if (system.isCC()) {
        this.applyCC(effect.subtype);
      }
    });

    this.buffs = this.buffs.filter((e) => e.duration > 0);
    this.debuffs = this.debuffs.filter((e) => e.duration > 0);
  }

  //tick damage and healing effects (DoT and HoT)
  tickEffectsDamageAndHeal(enemyCombatStats) {
    const allEffects = [...this.buffs, ...this.debuffs];
    let damage = 0;
    let heal = 0;
    allEffects.forEach((effect) => {
      const system = new EffectSystem(effect);
      const value = system.tick(this, enemyCombatStats);
      if (system.isDot()) {
        damage += this.takeDamage(value);
      } else if (system.isHot()) {
        heal += this.heal(value);
      }
    });
    return { damage, heal };
  }

  /* ---------------- COOLDOWNS ---------------- */

  setCooldown(skill) {
    if (skill.cooldown > 0) {
      this.cooldowns.set(skill.id, skill.cooldown);
    }
  }

  tickCooldowns() {
    for (const [id, cd] of this.cooldowns.entries()) {
      cd > 1 ? this.cooldowns.set(id, cd - 1) : this.cooldowns.delete(id);
    }
  }

  isOnCooldown(skill) {
    return this.cooldowns.has(skill.id);
  }
}
