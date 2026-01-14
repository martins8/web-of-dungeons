import CombatState from "src/game/gcomponents/combatState";

describe("CombatState", () => {
  const stats = { maxHp: 100 };

  describe("Initialization", () => {
    test("should initialize currentHp with stats.maxHp", () => {
      const state = new CombatState(stats);

      expect(state.currentHp).toBe(100);
    });

    test("should initialize buffs and debuffs as empty arrays", () => {
      const state = new CombatState(stats);

      expect(state.buffs).toEqual([]);
      expect(state.debuffs).toEqual([]);
    });

    test("should initialize crowd control states as false", () => {
      const state = new CombatState(stats);

      expect(state.cc).toEqual({
        stunned: false,
        silenced: false,
        rooted: false,
        slowed: false,
      });
    });

    test("should initialize cooldowns as a Map", () => {
      const state = new CombatState(stats);

      expect(state.cooldowns).toBeInstanceOf(Map);
      expect(state.cooldowns.size).toBe(0);
    });
  });

  describe("Damage and Death", () => {
    test("takeDamage should reduce currentHp", () => {
      const state = new CombatState(stats);

      state.takeDamage(30);

      expect(state.currentHp).toBe(70);
    });

    test("isDead should return false when hp is above zero", () => {
      const state = new CombatState(stats);

      expect(state.isDead()).toBe(false);
    });

    test("isDead should return true when hp reaches zero", () => {
      const state = new CombatState(stats);

      state.takeDamage(100);

      expect(state.isDead()).toBe(true);
    });
  });

  describe("Crowd Control", () => {
    test("isStunned should return false by default", () => {
      const state = new CombatState(stats);

      expect(state.isStunned()).toBe(false);
    });

    test("isStunned should reflect stunned state", () => {
      const state = new CombatState(stats);

      state.cc.stunned = true;

      expect(state.isStunned()).toBe(true);
    });
  });

  describe("Cooldown System", () => {
    const skill = { id: "fireball", cooldown: 3 };

    test("setCooldown should add skill to cooldown map", () => {
      const state = new CombatState(stats);

      state.setCooldown(skill);

      expect(state.cooldowns.has("fireball")).toBe(true);
      expect(state.cooldowns.get("fireball")).toBe(3);
    });

    test("setCooldown should not add skill if cooldown is zero", () => {
      const state = new CombatState(stats);

      state.setCooldown({ id: "dash", cooldown: 0 });

      expect(state.cooldowns.size).toBe(0);
    });

    test("isOnCooldown should return true when skill is on cooldown", () => {
      const state = new CombatState(stats);

      state.setCooldown(skill);

      expect(state.isOnCooldown(skill)).toBe(true);
    });

    test("isOnCooldown should return false when skill is not on cooldown", () => {
      const state = new CombatState(stats);

      expect(state.isOnCooldown(skill)).toBe(false);
    });

    test("tickCooldown should decrement cooldown values", () => {
      const state = new CombatState(stats);

      state.setCooldown(skill); // 3

      state.tickCooldown();

      expect(state.cooldowns.get("fireball")).toBe(2);
    });

    test("tickCooldown should remove skill when cooldown reaches zero", () => {
      const state = new CombatState(stats);

      state.setCooldown({ id: "ice", cooldown: 1 });

      state.tickCooldown();

      expect(state.cooldowns.has("ice")).toBe(false);
    });
  });
});
