import Skill from "src/game/value-objects/skill";
import Effect from "src/game/value-objects/effect";

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
    expect(skill.damage).not.toBeNull();
    if (!skill.damage) {
      throw new Error("Expected damage to be defined");
    }
    expect(skill.damage.typeDamage).toBe("physical");
  });

  test("should be initialize with effects prop", () => {
    const newSkill = new Skill({
      ...skill,
      effects: new Effect({
        id: "effect_bleed",
        target: "enemy",
        effectType: "dot",
        mechanic: "refresh",
        subtype: "bleed",
        scaling: {
          pDmg: 0.9,
        },
        duration: 5,
      }),
    });
    expect(newSkill).toBeDefined();
    expect(newSkill.metadata.name).toBe("Basic Attack");
    expect(newSkill.damage).not.toBeNull();
    if (!newSkill.damage) {
      throw new Error("Expected damage to be defined");
    }
    expect(newSkill.damage.typeDamage).toBe("physical");
    expect(newSkill.effects).not.toBeNull();
    if (!newSkill.effects) {
      throw new Error("Expected effects to be defined");
    }
    expect(newSkill.effects.effectType).toBe("dot");
  });
});
