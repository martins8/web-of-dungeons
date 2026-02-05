import decideSkill from "src/game/AI/normal";

function makeAttacker(
  { skills = [], currentHp = 100, maxHp = 100, stats = {} } = {},
  cdIds = [],
  cc = false,
) {
  const statsWithMax = { ...stats, maxHp };
  return {
    skills,
    stats: statsWithMax,
    health: { currentHp },
    combatState: {
      isOnCooldown: (skill) => cdIds.includes(skill.id),
      getEffectiveStats: () => statsWithMax,
      currentHp,
    },
    turnSystem: {
      isCrowdControlled: () => cc,
    },
  };
}

function makeDefender() {
  return { stats: {}, combatState: null };
}

describe("Normal AI - decideSkill", () => {
  test("returns null when no skills", () => {
    const attacker = makeAttacker({ skills: [] });
    expect(decideSkill(attacker, makeDefender())).toBeNull();
  });

  test("selects support heal when missing HP and heal effective", () => {
    const supportHeal = {
      id: "s_support",
      typeSkill: "support",
      heal: { scaling: { hPower: 1 } },
    };
    const dmg = { id: "s_dmg", damage: { scaling: { pDmg: 1 } } };

    const attacker = makeAttacker({
      skills: [supportHeal, dmg],
      currentHp: 40,
      maxHp: 100,
      stats: { hPower: 10 },
    });

    expect(decideSkill(attacker, makeDefender())).toBe("s_support");
  });

  test("selects hot effect heal when present", () => {
    const hot = {
      id: "s_hot",
      effects: { effectType: "hot", scaling: { hPower: 1 } },
    };
    const dmg = { id: "s_dmg2", damage: { scaling: { pDmg: 1 } } };

    const attacker = makeAttacker({
      skills: [hot, dmg],
      currentHp: 10,
      maxHp: 50,
      stats: { hPower: 5 },
    });

    expect(decideSkill(attacker, makeDefender())).toBe("s_hot");
  });

  test("ignores cooldowned skills and picks next available", () => {
    const onCd = { id: "on_cd", damage: { scaling: { pDmg: 1 } } };
    const dmg = { id: "s_dmg3", damage: { scaling: { pDmg: 1 } } };

    const attacker = makeAttacker(
      { skills: [onCd, dmg], currentHp: 100, maxHp: 100, stats: {} },
      ["on_cd"],
    );

    expect(decideSkill(attacker, makeDefender())).toBe("s_dmg3");
  });

  test("respects crowd control and returns null if blocked", () => {
    const dmg = { id: "s_dmg4", damage: { scaling: { pDmg: 1 } } };
    const attacker = makeAttacker(
      { skills: [dmg], currentHp: 100, maxHp: 100, stats: {} },
      [],
      true,
    );

    expect(decideSkill(attacker, makeDefender())).toBeNull();
  });

  test("fallback to first available skill id if no damage/heal present", () => {
    const misc = { id: "s_misc" };
    const attacker = makeAttacker({
      skills: [misc],
      currentHp: 100,
      maxHp: 100,
      stats: {},
    });

    expect(decideSkill(attacker, makeDefender())).toBe("s_misc");
  });
});
