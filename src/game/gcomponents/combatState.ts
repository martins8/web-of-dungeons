import StatsCalculator from "src/game/services/statsCalculator";
import Health from "src/game/gcomponents/health";
import EffectSystem from "src/game/systems/effectSystem";
import type Effect from "src/game/value-objects/effect";
import type Attributes from "src/game/value-objects/attributes";
import type { StatsProps, StatKey } from "src/game/value-objects/stats";
import Item, { EquipmentItemParam, ItemParam } from "../value-objects/item";

type CrowdControlKey = "stunned" | "silenced" | "rooted" | "slowed";

export interface ClonedEffect {
  id: string;
  effectType: string;
  mechanic: string;
  subtype: string | null;
  scaling: Record<string, number>;
  duration: number | null;
  source: unknown;
}

/**
 * CombatState holds the runtime state for an entity while in combat.
 * It aggregates base stats/attributes and mutable combat data such as
 * current HP, active buffs/debuffs, crowd control flags and cooldowns.
 *
 * Public API intentionally mirrors domain actions: `takeDamage`, `heal`,
 * `tickEffects`, `tickCooldowns`, `getEffectiveStats` and helpers.
 */

export default class CombatState {
  baseStats: StatsProps;
  baseAttributes: Attributes;
  health: Health;
  buffs: ClonedEffect[];
  debuffs: ClonedEffect[];
  cc: Record<CrowdControlKey, boolean>;
  cooldowns: Map<string, number>;
  equipments: Record<string, EquipmentItemParam>;

  constructor(
    stats: StatsProps,
    attributes: Attributes,
    equipments: Record<string, EquipmentItemParam> = {},
  ) {
    this.baseStats = { ...stats };
    this.baseAttributes = attributes;
    this.equipments = equipments;

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
  get currentHp(): number {
    return this.health.currentHp;
  }

  takeDamage(amount: number): number {
    this.health.takeDamage(amount);
    return amount;
  }

  heal(amount: number): number {
    // ensure we don't exceed dynamic maxHp
    const maxHp = this.getEffectiveStats().maxHp;
    // if maxHp changed, sync health max
    if (this.health.maxHp !== maxHp) {
      this.health.increaseMaxHp(maxHp - this.health.maxHp);
    }
    this.health.heal(amount);
    return amount;
  }

  isDead(): boolean {
    return !this.health.isAlive();
  }

  /* ---------------- EFFECTS ---------------- */

  resetEffects(): void {
    this.buffs = [];
    this.debuffs = [];
  }

  addEffect(effect: Effect, targetArray: ClonedEffect[]): void {
    const cloneEffect = this.cloneEffect(effect);
    const existingEffect = this.getEffectById(cloneEffect);

    if (cloneEffect.mechanic === "refresh" && existingEffect) {
      existingEffect.duration = cloneEffect.duration;
    } else {
      targetArray.push(cloneEffect);
    }
  }

  addBuff(effect: Effect): void {
    this.addEffect(effect, this.buffs);
  }

  addDebuff(effect: Effect): void {
    this.addEffect(effect, this.debuffs);
  }

  getAllEffects(): ClonedEffect[] {
    return [...this.buffs, ...this.debuffs];
  }

  getEffectById(cloneEffect: ClonedEffect): ClonedEffect | undefined {
    const allEffects = this.getAllEffects();
    return allEffects.find((effect) => effect.id === cloneEffect.id);
  }

  cloneEffect(effect: Effect): ClonedEffect {
    const anyEffect = effect as any;
    return {
      id: anyEffect.id,
      effectType: anyEffect.effectType,
      mechanic: anyEffect.mechanic,
      subtype: anyEffect.subtype ?? null,
      scaling: { ...(anyEffect.scaling ?? {}) },
      duration: anyEffect.duration === undefined ? 0 : anyEffect.duration,
      source: anyEffect.source ?? null,
    } as ClonedEffect;
  }

  applyCC(type: CrowdControlKey): void {
    this.cc[type] = true;
  }

  clearCC(): void {
    (Object.keys(this.cc) as CrowdControlKey[]).forEach(
      (k) => (this.cc[k] = false),
    );
  }

  /* ---------------- EFFECTIVE ATTRIBUTES ---------------- */

  getEffectiveAttributes(): Attributes {
    let attrs = this.baseAttributes;

    this.getAllEffects().forEach((effect) => {
      if (effect.subtype === "attribute") {
        for (const [attr, value] of Object.entries(effect.scaling)) {
          attrs = (attrs as any).increase(attr, value);
        }
      }
    });

    return attrs;
  }

  /* ---------------- EFFECTIVE STATS ---------------- */

  getEffectiveStats(): StatsProps {
    /* SNAPSHOT STATS IN THE FUTURE*/
    let stats = StatsCalculator.calculate(this.getEffectiveAttributes());

    this.getAllEffects().forEach((effect) => {
      if (effect.subtype === "stats") {
        for (const [key, value] of Object.entries(effect.scaling)) {
          (stats as any)[key as StatKey] += value;
        }
      }
    });

    for (const item of Object.values(this.equipments)) {
      if (!item?.equipmentItem?.stats) continue;
      for (const [key, value] of Object.entries(item.equipmentItem.stats)) {
        stats[key as StatKey] += value;
      }
    }

    return stats;
  }

  /* ---------------- TICK ---------------- */
  // tick timers for buffs, debuffs, and crowd control effects
  tickEffects(): void {
    this.clearCC();

    const allEffects = this.getAllEffects();

    allEffects.forEach((effect) => {
      const system = new EffectSystem(effect as any);
      if (typeof effect.duration === "number") {
        effect.duration -= 1;
      }

      if (system.isCC()) {
        this.applyCC(effect.subtype as CrowdControlKey);
      }
    });

    this.buffs = this.buffs.filter(
      (e) => e.duration === null || e.duration > 0,
    );
    this.debuffs = this.debuffs.filter(
      (e) => e.duration === null || e.duration > 0,
    );
  }

  // tick damage and healing effects (DoT and HoT)
  tickEffectsDamageAndHeal(enemyCombatStats: StatsProps): {
    damage: number;
    heal: number;
  } {
    const allEffects = this.getAllEffects();
    let damage = 0;
    let heal = 0;
    allEffects.forEach((effect) => {
      const system = new EffectSystem(effect as any);
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

  setCooldown(skill: { id: string; cooldown: number }): void {
    if (skill.cooldown > 0) {
      this.cooldowns.set(skill.id, skill.cooldown);
    }
  }

  tickCooldowns(): void {
    for (const [id, cd] of this.cooldowns.entries()) {
      cd > 1 ? this.cooldowns.set(id, cd - 1) : this.cooldowns.delete(id);
    }
  }

  isOnCooldown(skill: { id: string }): boolean {
    return this.cooldowns.has(skill.id);
  }
}
