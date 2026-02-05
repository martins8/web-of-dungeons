import EffectSystem from "src/game/systems/effectSystem";
import Effect from "src/game/value-objects/effect";
import type { StatsProps } from "src/game/value-objects/stats";
import type CombatState from "src/game/gcomponents/combatState";

const buildStats = (overrides: Partial<StatsProps> = {}): StatsProps => ({
  pDmg: 0,
  mDmg: 0,
  pDef: 0,
  mDef: 0,
  critC: 0,
  critD: 0,
  eva: 0,
  luck: 0,
  init: 0,
  speed: 0,
  maxHp: 1,
  hPower: 0,
  maestry: 0,
  ...overrides,
});

describe("EffectSystem TESTS", () => {
  test("should return DOT damage value on tick", () => {
    const effect = new Effect({
      id: "dot_1",
      target: "enemy",
      effectType: "dot",
      mechanic: "refresh",
      subtype: "bleed",
      scaling: { pDmg: 1 },
      duration: 2,
    });

    const combatState = {
      getEffectiveStats: () => buildStats({ pDmg: 10 }),
    } as unknown as CombatState;
    const combatEnemyStats = buildStats({ pDmg: 10 });

    const system = new EffectSystem(effect);
    const damage = system.tick(combatState, combatEnemyStats);

    expect(damage).toBe(10);
  });
  test("should return HOT heal value on tick", () => {
    const effect = new Effect({
      id: "hot_1",
      target: "self",
      effectType: "hot",
      mechanic: "refresh",
      scaling: { hPower: 2 },
      duration: 2,
    });

    const combatState = {
      getEffectiveStats: () => buildStats({ hPower: 5 }),
    } as unknown as CombatState;

    const system = new EffectSystem(effect);
    const heal = system.tick(combatState, buildStats());

    expect(heal).toBe(10);
  });
  test("should apply CC correctly", () => {
    const effect = new Effect({
      id: "cc_1",
      target: "enemy",
      effectType: "cc",
      mechanic: "refresh",
      subtype: "stun",
      duration: 1,
    });

    const combatState = {
      addBuff: jest.fn(),
      addDebuff: jest.fn(),
      applyCC: jest.fn(),
    } as unknown as CombatState;

    const system = new EffectSystem(effect);
    system.apply(combatState);

    expect(combatState.applyCC).toHaveBeenCalledWith("stun");
  });
});
