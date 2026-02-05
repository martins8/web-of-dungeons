import Skill from "src/game/value-objects/skill";

const skill = new Skill({
  id: "skill_001",
  rank: 1,
  typeSkill: "action",
  reach: "melee",
  cooldown: 0,
  damage: {
    typeDamage: "physical",
    scaling: {
      pDmg: 1,
    },
  },
  metadata: {
    name: "Basic Attack",
    text: "a basic attack",
    rarity: "common",
  },
});
describe("Skills TEST", () => {
  test("should initialize physical skill correctly", () => {
    expect(skill).toBeDefined();
    expect(skill.metadata.name).toBe("Basic Attack");
    expect(skill.damage.typeDamage).toBe("physical");
  });

  test("should be initialize with effects prop", () => {
    const newSkill = new Skill({
      ...skill,
      effects: {
        effectType: "bleed",
        scaling: {
          pDmg: 0.9,
        },
        ticks: 5,
      },
    });
    expect(newSkill).toBeDefined();
    expect(newSkill.metadata.name).toBe("Basic Attack");
    expect(newSkill.damage.typeDamage).toBe("physical");
    expect(newSkill.effects).toBeDefined();
    expect(newSkill.effects.effectType).toBe("bleed");
  });
});
