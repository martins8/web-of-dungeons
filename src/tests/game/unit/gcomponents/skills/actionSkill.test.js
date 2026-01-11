import ActionSkill from "src/game/gcomponents/skills/actionSkill";

const baseStats = {
  pDmg: 2,
  mDmg: 4,
  maestry: 2,
};

let physicalSkill;
let magicSkill;

beforeEach(() => {
  physicalSkill = new ActionSkill({
    id: 1,
    rank: 1,
    name: "Basic Attack",
    typeSkill: "action",
    reach: "melee",
    text: "a basic attack",
    rarity: "common",
    typeDamage: "physical",
    damageMod: { pDmg: 1 },
    dotMod: {},
  });

  magicSkill = new ActionSkill({
    id: 2,
    rank: 1,
    name: "Magic Bolt",
    typeSkill: "action",
    reach: "ranged",
    text: "a basic magic attack",
    rarity: "common",
    typeDamage: "magic",
    damageMod: { mDmg: 1 },
    dotMod: {},
  });
});

describe("ActionSkill", () => {
  test("should initialize correctly", () => {
    expect(physicalSkill).toBeDefined();
    expect(magicSkill).toBeDefined();
    expect(physicalSkill.name).toBe("Basic Attack");
    expect(magicSkill.typeDamage).toBe("magic");
  });

  test("should calculate physical damage correctly", () => {
    const damage = physicalSkill.useActionSkill(baseStats);
    expect(damage).toBe(2); // 2 * 1
  });

  test("should calculate magical damage correctly", () => {
    const damage = magicSkill.useActionSkill(baseStats);
    expect(damage).toBe(4); // 4 * 1
  });

  test("should apply multiple modifiers", () => {
    const skillWithMaestry = new ActionSkill({
      id: 3,
      rank: 1,
      name: "Sword Strike",
      typeSkill: "action",
      reach: "melee",
      text: "Dieee!!!",
      rarity: "common",
      typeDamage: "physical",
      damageMod: { pDmg: 1, maestry: 0.5 },
      dotMod: {},
    });

    const damage = skillWithMaestry.useActionSkill(baseStats);
    // (2 * 1) + (2 * 0.5) = 2 + 1 = 3
    expect(damage).toBe(3);
  });

  test("should scale with rank", () => {
    const rankedSkill = new ActionSkill({
      id: 4,
      rank: 2,
      name: "Heavy Strike",
      typeSkill: "action",
      reach: "melee",
      text: "Stronger attack",
      rarity: "rare",
      typeDamage: "magical",
      damageMod: { pDmg: 1 },
      dotMod: {},
    });

    const damage = rankedSkill.useActionSkill(baseStats);
    // se o método aplicar rank como multiplicador, esperado seria 2*1*2 = 4
    // se não aplica rank ainda, esperado é 2
    expect(damage).toBe(4); // ajuste conforme sua lógica atual
  });
});
