import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import CritSystem from "../rng/critSystem";
import EvadeSystem from "../rng/evadeSystem";
import utils from "src/game/utils/utils";
import TurnSystem from "../systems/turnSystem";
import CombatState from "../gcomponents/combatState";
import LevelCalculator from "../services/levelCalculator";
import Experience from "../gcomponents/experience";
import Gold from "../gcomponents/gold";

const BASE_ATTR_POINTS = 14;
const ATTR_POINTS_PER_LEVEL = 2;

/**
 * PERSIST
 * NAME
 * ATTR
 * SKILLS
 * ISMOB
 * GOLD
 * XP
 * EQUIPS
 */
export default class Character {
  constructor(
    name,
    attrValues,
    skills = [],
    isMob = false,
    gold = 0,
    xp = 0,
    attrPoints = 0,
  ) {
    utils.validateName(name, isMob);
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

    this._isMob = isMob;

    this.gold = new Gold(gold);
    this.xp = new Experience(xp);

    if (!this._isMob && attrPoints < 0) {
      throw new Error("Invalid attrPoints state");
    }
    this.attrPoints = attrPoints;
  }

  //this method needs to go a factory
  /*
  initAttrPoints() {
    if (this._isMob) {
      this.attrPoints = 0;
      return;
    }
    const level = this.xp.level;
    this.attrPoints = BASE_ATTR_POINTS + (level - 1) * ATTR_POINTS_PER_LEVEL;
  }
  */

  gainXP(amount) {
    const oldLevel = this.xp.level;
    this.xp.gain(amount);
    const newLevel = this.xp.level;

    if (newLevel > oldLevel) {
      this.onLevelUp(oldLevel, newLevel);
    }
  }

  onLevelUp(oldLevel, newLevel) {
    this.attrPoints += (newLevel - oldLevel) * ATTR_POINTS_PER_LEVEL;
  }

  increaseAttr(attribute, amount) {
    if (amount > this.attrPoints) {
      throw new Error(
        `Error: insufficient attribute points amount: ${amount} | u have: ${this.attrPoints}`,
      );
    }
    if (amount < 1) {
      throw new Error("Error: increase needs to be a positive number");
    }

    this.attributes.increase(attribute, amount);
    this.attrPoints -= amount;
  }

  isMob() {
    return this._isMob;
  }

  initCombatState() {
    if (this.combatState) return;
    this.combatState = new CombatState(this.stats, this.attributes);
  }

  finishCombatState() {
    this.combatState = null;
  }

  getSkillById(id) {
    const skill = this.skills.find((s) => s.id === id);
    if (!skill) throw new Error(`Skill ${id} not found`);
    return skill;
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
