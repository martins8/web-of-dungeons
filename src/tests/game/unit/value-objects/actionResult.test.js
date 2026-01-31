import ActionResult from "src/game/value-objects/actionResult";

describe("ActionResult", () => {
  test("should create a success result with static method", () => {
    const result = ActionResult.success("Attack landed!");

    expect(result.ok).toBe(true);
    expect(result.data).toBe("Attack landed!");
    expect(result.reason).toBe(null);
  });

  test("should create a failure result with static method", () => {
    const result = ActionResult.failure("SKILL_ON_COOLDOWN");

    expect(result.ok).toBe(false);
    expect(result.data).toBe(null);
    expect(result.reason).toBe("SKILL_ON_COOLDOWN");
  });

  test("should check if result is successful with isSuccess()", () => {
    const success = ActionResult.success("OK");
    const failure = ActionResult.failure("ERROR");

    expect(success.isSuccess()).toBe(true);
    expect(failure.isSuccess()).toBe(false);
  });

  test("should check if result is failure with isFailure()", () => {
    const success = ActionResult.success("OK");
    const failure = ActionResult.failure("ERROR");

    expect(success.isFailure()).toBe(false);
    expect(failure.isFailure()).toBe(true);
  });

  test("should create result with constructor", () => {
    const result = new ActionResult(true, { text: "done" }, null);

    expect(result.ok).toBe(true);
    expect(result.data).toEqual({ text: "done" });
    expect(result.reason).toBe(null);
  });

  test("should handle complex data in success results", () => {
    const data = {
      damage: 25,
      isCritical: true,
      effects: ["bleeding"],
    };

    const result = ActionResult.success(data);

    expect(result.data).toEqual(data);
    expect(result.isSuccess()).toBe(true);
  });
});
