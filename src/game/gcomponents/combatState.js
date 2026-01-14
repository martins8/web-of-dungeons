export default class CombatState {
  constructor(stats) {
    this.currentHp = stats.maxHp;

    this.buffs = [];
    this.debuffs = [];

    this.cc = {
      stunned: false,
      silenced: false,
      rooted: false,
      slowed: false,
    };

    // skillId -> cooldown restante
    this.cooldowns = new Map();
  }

  takeDamage(amount) {
    this.currentHp = Math.max(0, this.currentHp - amount);
  }

  isDead() {
    return this.currentHp <= 0;
  }

  isStunned() {
    return this.cc.stunned;
  }

  tickCooldown() {
    for (const [skillId, cd] of this.cooldowns.entries()) {
      if (cd > 1) {
        this.cooldowns.set(skillId, cd - 1);
      } else {
        this.cooldowns.delete(skillId);
      }
    }
  }

  setCooldown(skill) {
    if (skill.cooldown > 0) {
      this.cooldowns.set(skill.id, skill.cooldown);
    }
  }

  isOnCooldown(skill) {
    return this.cooldowns.has(skill.id);
  }
}
