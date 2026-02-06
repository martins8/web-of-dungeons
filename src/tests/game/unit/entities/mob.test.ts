import Mob from "src/game/entities/mob";

const validAttributes = {
  sta: 10,
  str: 10,
  con: 10,
  dex: 10,
  int: 10,
  wis: 10,
  agi: 10,
  cha: 10,
};

const rewards = {
  xp: 10,
  gold: 1,
};

describe("Mob Entity", () => {
  test("should be create a valid mob instance", () => {
    const mob = new Mob(
      "Test Mob",
      validAttributes,
      [],
      "test_01",
      "normal",
      "beast",
      "test description",
      rewards,
    );

    expect(mob.name).toBe("Test Mob");
    expect(mob.id).toBe("test_01");
    expect(mob.type).toBe("normal");
    expect(mob.archetype).toBe("beast");
    expect(mob.description).toBe("test description");
    expect(mob.rewards.xp).toBe(10);
    expect(mob.rewards.gold).toBe(1);
  });

  test("inherits from Character", () => {
    const mob = new Mob(
      "Mob",
      validAttributes,
      [],
      "mob_01",
      "normal",
      "beast",
      "test description",
      rewards,
    );

    expect(mob).toHaveProperty("attributes");
    expect(mob).toHaveProperty("skills");
  });
});
