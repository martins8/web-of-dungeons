import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import CritSystem from "../rng/critSystem";
import EvadeSystem from "../rng/evadeSystem";
import utils from "src/game/utils/utils";
import TurnSystem from "../systems/turnSystem";
import CombatState from "../gcomponents/combatState";

export default class Character {
  constructor(name, attrValues, skills = []) {
    utils.validateName(name);
    this.name = name;
    this.attributes = new Attributes(attrValues);
    this.stats = StatsCalculator.calculate(this.attributes);
    this.health = new Health(this.stats.maxHp);
    this.critSystem = new CritSystem({
      bonusPerFail: 2,
      maxChance: 50,
    });
    this.evadeSystem = new EvadeSystem({
      bonusPerFail: 1,
      maxChance: 40,
    });
    this.skills = skills;
    this.turnSystem = new TurnSystem();
    this.combatState = null;
  }

  initCombatState() {
    this.combatState = new CombatState(this.stats, this.attributes);
  }

  finishCombatState() {
    this.combatState = null;
  }

  getSkillById(id) {
    return this.skills.find((skill) => skill.id === id);
  }

  isDead() {
    return this.combatState?.isDead() ?? false;
  }

  startTurn() {
    this.turnSystem.startTurn();
  }

  endTurn() {
    this.turnSystem.endTurn();
  }
}
