import StatsCalculator from "src/game/services/statsCalculator";
import Health from "src/game/gcomponents/health";
import EffectSystem from "src/game/systems/effectSystem";

import StatsCalculator from "src/game/services/statsCalculator";
import Health from "src/game/gcomponents/health";

/**
 * CombatState holds the runtime state for an entity while in combat.
 * It aggregates base stats/attributes and mutable combat data such as
 * current HP, active buffs/debuffs, crowd control flags and cooldowns.
 *
 * Public API intentionally mirrors domain actions: `takeDamage`, `heal`,
 * `tickEffects`, `tickCooldowns`, `getEffectiveStats` and helpers.
 */

export default class CombatState {
  constructor(stats, attributes) {
    this.baseStats = { ...stats };
    this.baseAttributes = attributes;

    this.health = new Health(stats.maxHp);

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

  // Health proxies
  get currentHp() {
    return this.health.currentHp;
  }

  takeDamage(amount) {
    this.health.takeDamage(amount);
    return amount;
  }

  heal(amount) {
    // ensure we don't exceed dynamic maxHp
    const maxHp = this.getEffectiveStats().maxHp;
    // if maxHp changed, sync health max
    if (this.health.maxHp !== maxHp) {
      this.health.increaseMaxHp(maxHp - this.health.maxHp);
    }
    this.health.heal(amount);
    return amount;
  }

  isDead() {
    return !this.health.isAlive();
  }

  /* ---------------- EFFECTS ---------------- */

  resetEffects() {
    this.buffs = [];
    this.debuffs = [];
  }

  addEffect(effect, targetArray) {
    const cloneEffect = this.cloneEffect(effect);
    const existingEffect = this.getEffectById(cloneEffect);

    if (cloneEffect.mechanic === "refresh" && existingEffect) {
      existingEffect.duration = cloneEffect.duration;
    } else {
      targetArray.push(cloneEffect);
    }
  }

  addBuff(effect) {
    this.addEffect(effect, this.buffs);
  }

  addDebuff(effect) {
    this.addEffect(effect, this.debuffs);
  }

  getAllEffects() {
    return [...this.buffs, ...this.debuffs];
  }

  getEffectById(cloneEffect) {
    const allEffects = this.getAllEffects();
    return allEffects.find((effect) => effect.id === cloneEffect.id);
  }

  cloneEffect(effect) {
    return {
      effectType: effect.effectType,
      mechanic: effect.mechanic,
      subtype: effect.subtype,
      scaling: { ...effect.scaling },
      duration: effect.duration,
      source: effect.source ?? null,
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

    this.getAllEffects().forEach((effect) => {
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
    /* SNAPSHOT STATS IN THE FUTURE*/
    let stats = StatsCalculator.calculate(this.getEffectiveAttributes());

    this.getAllEffects().forEach((effect) => {
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

    const allEffects = this.getAllEffects();

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
    const allEffects = this.getAllEffects();
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
