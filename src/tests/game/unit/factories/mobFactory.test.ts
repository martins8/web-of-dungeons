import MobFactory from "src/game/factories/mobFactory";
import Mob from "src/game/entities/mob";

describe("MobFactory", () => {
  test("creates a mob from valid id", () => {
    const mob = MobFactory.fromMobId("wolf_01");

    expect(mob).toBeInstanceOf(Mob);
    expect(mob.id).toBe("wolf_01");
    expect(mob.name).toBeDefined();
  });

  test("assigns correct attributes", () => {
    const mob = MobFactory.fromMobId("wolf_01");

    expect(mob.attributes.sta).toBe(8);
    expect(mob.attributes.str).toBe(8);
    expect(mob.attributes.agi).toBe(8);
  });

  test("resolves skills from registry", () => {
    const mob = MobFactory.fromMobId("wolf_01");

    expect(mob.skills.length).toBeGreaterThan(0);
    expect(mob.skills[0]).toHaveProperty("id");
    expect(mob.skills[0]).toHaveProperty("damage");
  });

  test("throws error for invalid mob id", () => {
    expect(() => {
      MobFactory.fromMobId("invalid_id");
    }).toThrow("Mob invalid_id not found");
  });
});
