import ActionSkill from "src/game/gcomponents/skills/actionSkill";

const baseStats = {
  pDmg: 2,
  mDmg: 4,
  maestry: 6,
};
const physicalSkill = new ActionSkill({
  id: 1,
  rank: 1,
  name: "Basic Attack",
  typeSkill: "action",
  reach: "melee",
  text: "a basic attack",
  rarity: "common",
  typeDamage: "physical",
  damageMod: {
    pDmg: 1,
  },
  dotMod: {},
});
const magicSkill = new ActionSkill({
  id: 1,
  rank: 1,
  name: "Basic Attack",
  typeSkill: "action",
  reach: "ranged",
  text: "a basic magic attack",
  rarity: "common",
  typeDamage: "magic",
  damageMod: {
    mDmg: 1,
  },
  dotMod: {},
});

describe("Action SKILLS TEST", () => {
  test("Action Skills INITIALIZATION", () => {
    expect(physicalSkill).toBeDefined();
  });

  test("should be able to differentiate the modifiers according to the typeDamage", () => {
    const damagePhysical = physicalSkill.useActionSkill(baseStats);
    expect(damagePhysical).toBe(2);
    const damageMagical = magicSkill.useActionSkill(baseStats);
    expect(damageMagical).toBe(4);
  });
});
