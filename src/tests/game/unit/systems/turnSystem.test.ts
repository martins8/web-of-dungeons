import TurnSystem from "src/game/systems/turnSystem";
import type Skill from "src/game/value-objects/skill";

describe("TurnSystem", () => {
  test("INITIALIZATION: should initialize with default values", () => {
    const turnSystem = new TurnSystem();

    expect(turnSystem).toBeDefined();
    expect(turnSystem.actionsPerTurn).toBe(2);
    expect(turnSystem.actionsOnTurn).toBe(2);
    expect(turnSystem.turnCount).toBe(0);
    expect(turnSystem.crowdControlEffects).toEqual([]);
  });

  test("START TURN: should reset actions and flags", () => {
    const turnSystem = new TurnSystem();

    // simula uso de ações
    turnSystem.actionsOnTurn = 0;
    turnSystem.startTurn();
    expect(turnSystem.actionsOnTurn).toBe(2);
  });

  test("USE TURN: should consume action when using action skill", () => {
    const turnSystem = new TurnSystem();

    const actionSkill = { typeSkill: "action" } as Skill;

    const result = turnSystem.useTurn(actionSkill);

    expect(result.isSuccess()).toBe(true);
  });

  test("USE TURN: should block action when stunned", () => {
    const turnSystem = new TurnSystem();
    const actionSkill = { typeSkill: "action" } as Skill;

    turnSystem.crowdControlEffects.push("stun");

    const result = turnSystem.useTurn(actionSkill);

    expect(result.isFailure()).toBe(true);
    expect(result.reason).toBe("CROWD_CONTROLLED");
    expect(turnSystem.actionsOnTurn).toBe(2);
  });

  test("END TURN: should increment turn count and clear CC", () => {
    const turnSystem = new TurnSystem();

    turnSystem.crowdControlEffects.push("stun");
    turnSystem.endTurn();

    expect(turnSystem.turnCount).toBe(1);
    expect(turnSystem.crowdControlEffects).toEqual([]);
  });
});
