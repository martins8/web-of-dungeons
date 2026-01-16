import CombatState from "src/game/gcomponents/combatState";
import Attributes from "src/game/value-objects/attributes";
import StatsCalculator from "src/game/services/statsCalculator";

describe("CombatState", () => {
  function createState() {
    const attributes = new Attributes({
      sta: 10,
      str: 10,
      con: 10,
      dex: 10,
      int: 10,
      wis: 10,
      agi: 10,
      cha: 10,
    });

    const stats = StatsCalculator.calculate(attributes);
    return new CombatState(stats, attributes);
  }

  test("should apply buff to attributes", () => {
    const state = createState();

    state.addBuff({
      effectType: "buff",
      subtype: "attribute",
      scaling: { str: 5 },
      duration: 2,
    });

    const effectiveAttrs = state.getEffectiveAttributes();
    expect(effectiveAttrs.str).toBe(15);
  });

  test("should apply debuff to stats", () => {
    const state = createState();

    state.addDebuff({
      effectType: "debuff",
      subtype: "stats",
      scaling: { pDef: -5 },
      duration: 2,
    });

    const effectiveStats = state.getEffectiveStats();
    expect(effectiveStats.pDef).toBeLessThan(state.baseStats.pDef);
  });

  test("should tick DOT and reduce HP", () => {
    const state = createState();
    const initialHp = state.currentHp;

    state.addDebuff({
      effectType: "dot",
      scaling: { pDmg: 1 },
      duration: 2,
    });

    const result = state.tickEffectsDamageAndHeal();

    expect(state.currentHp).toBeLessThan(initialHp);
    expect(result.damage).toBeGreaterThan(0);
  });

  test("should expire effects after duration", () => {
    const state = createState();

    state.addBuff({
      effectType: "buff",
      subtype: "stats",
      scaling: { pDmg: 10 },
      duration: 1,
    });

    state.tickEffects();

    expect(state.buffs.length).toBe(0);
  });

  test("should apply and clear CC each tick", () => {
    const state = createState();

    state.addDebuff({
      effectType: "cc",
      subtype: "stunned",
      duration: 1,
    });

    state.tickEffects();
    expect(state.cc.stunned).toBe(true);

    state.tickEffects();
    expect(state.cc.stunned).toBe(false);
  });
  test("should apply and clear CC correctly", () => {
    const state = createState();

    state.addDebuff({
      effectType: "cc",
      subtype: "stunned",
      duration: 1,
    });

    state.tickEffects();
    expect(state.cc.stunned).toBe(true);

    state.tickEffects();
    expect(state.cc.stunned).toBe(false);
    expect(state.debuffs.length).toBe(0);
  });

  test("should handle cooldown lifecycle", () => {
    const state = createState();
    const skill = { id: "skill_1", cooldown: 2 };

    state.setCooldown(skill);
    expect(state.isOnCooldown(skill)).toBe(true);

    state.tickCooldowns();
    expect(state.isOnCooldown(skill)).toBe(true);

    state.tickCooldowns();
    expect(state.isOnCooldown(skill)).toBe(false);
  });
});
