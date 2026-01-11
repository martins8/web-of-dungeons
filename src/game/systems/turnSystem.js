export default class TurnSystem {
  constructor(actionsPerTurn = 2) {
    this.actionsPerTurn = actionsPerTurn;
    this.turnCount = 0;
    this.crowdControlEffects = [];

    this.resetActions();
  }

  resetActions() {
    this.actionsOnTurn = this.actionsPerTurn;
    this.actionSkillUsed = false;
    this.buffSkillUsed = false;
  }

  startTurn() {
    this.resetActions();
  }

  useTurn(skill) {
    if (this.isCrowdControlled(skill)) {
      return { ok: false, reason: "CROWD_CONTROLLED" };
    }

    if (this.actionsOnTurn <= 0) {
      return { ok: false, reason: "NO_ACTIONS_LEFT" };
    }

    switch (skill.typeSkill) {
      case "action":
        if (this.actionSkillUsed) {
          return { ok: false, reason: "ACTION_ALREADY_USED" };
        }
        this.actionSkillUsed = true;
        break;

      case "buff":
        if (this.buffSkillUsed) {
          return { ok: false, reason: "BUFF_ALREADY_USED" };
        }
        this.buffSkillUsed = true;
        break;

      default:
        return { ok: false, reason: "UNKNOWN_SKILL_TYPE" };
    }

    this.actionsOnTurn -= 1;
    return { ok: true };
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
