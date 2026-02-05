import ActionResult from "src/game/value-objects/actionResult";
import type Skill from "src/game/value-objects/skill";

/**
 * TurnSystem tracks available actions per turn, turn count and crowd control
 * effects that block actions. It exposes `useTurn()` which validates and
 * consumes an action and returns an `ActionResult`.
 */
export default class TurnSystem {
  actionsPerTurn: number;
  actionsOnTurn: number = 0;
  turnCount: number;
  crowdControlEffects: string[];

  constructor(actionsPerTurn: number = 2) {
    this.actionsPerTurn = actionsPerTurn;
    this.turnCount = 0;
    this.crowdControlEffects = [];

    this.startTurn();
  }

  startTurn(): void {
    this.actionsOnTurn = this.actionsPerTurn;
    // this.actionSkillUsed = false;
    // this.buffSkillUsed = false;
  }

  useTurn(skill: Skill): ActionResult {
    if (this.isCrowdControlled(skill)) {
      return ActionResult.failure("CROWD_CONTROLLED");
    }

    if (this.actionsOnTurn <= 0) {
      return ActionResult.failure("NO_ACTIONS_LEFT");
    }

    /*
    if (skill.typeSkill === "action") {
      if (this.actionSkillUsed) {
        return ActionResult.failure("ACTION_ALREADY_USED");
      }
      this.actionSkillUsed = true;
    }

    if (skill.typeSkill === "buff") {
      if (this.buffSkillUsed) {
        return ActionResult.failure("BUFF_ALREADY_USED");
      }
      this.buffSkillUsed = true;
    }*/

    this.actionsOnTurn -= 1;
    return ActionResult.success();
  }

  isCrowdControlled(skill: Skill): boolean {
    if (this.crowdControlEffects.includes("stun")) return true;
    if (
      this.crowdControlEffects.includes("silence") &&
      (skill as any).typeSkill === "action"
    ) {
      return true;
    }
    return false;
  }

  endTurn(): void {
    this.turnCount += 1;
    this.crowdControlEffects = [];
  }
}

