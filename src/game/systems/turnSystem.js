import ActionResult from "src/game/value-objects/actionResult";

export default class TurnSystem {
  constructor(actionsPerTurn = 2) {
    this.actionsPerTurn = actionsPerTurn;
    this.turnCount = 0;
    this.crowdControlEffects = [];

    this.startTurn();
  }

  startTurn() {
    this.actionsOnTurn = this.actionsPerTurn;
    //this.actionSkillUsed = false;
    //this.buffSkillUsed = false;
  }

  useTurn(skill) {
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

  isCrowdControlled(skill) {
    if (this.crowdControlEffects.includes("stun")) return true;
    if (
      this.crowdControlEffects.includes("silence") &&
      skill.typeSkill === "action"
    ) {
      return true;
    }
    return false;
  }

  endTurn() {
    this.turnCount += 1;
    this.crowdControlEffects = [];
  }
}
