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
    );

    expect(mob.name).toBe("Test Mob");
    expect(mob.id).toBe("test_01");
    expect(mob.type).toBe("normal");
    expect(mob.archetype).toBe("beast");
    expect(mob.description).toBe("test description");
  });

  test("inherits from Character", () => {
    const mob = new Mob(
      "Mob",
      validAttributes,
      [],
      "mob_01",
      "normal",
      "beast",
    );

    expect(mob).toHaveProperty("attributes");
    expect(mob).toHaveProperty("skills");
  });
});
