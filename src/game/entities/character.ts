import StatsCalculator from "src/game/services/statsCalculator";
import Attributes, {
  AttributesProps,
  AttributeKey,
} from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import CritSystem from "../rng/critSystem";
import EvadeSystem from "../rng/evadeSystem";
import utils from "src/game/utils/utils";
import TurnSystem from "../systems/turnSystem";
import CombatState from "../gcomponents/combatState";
import Experience from "../gcomponents/experience";
import Gold from "../gcomponents/gold";
import type Skill from "src/game/value-objects/skill";
import type Stats from "src/game/value-objects/stats";
import { MobRewards } from "./mob";

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
  name: string;
  attributes: Attributes;
  stats: Stats;
  health: Health;
  critSystem: CritSystem;
  evadeSystem: EvadeSystem;
  skills: Skill[];
  turnSystem: TurnSystem;
  combatState: CombatState | null;
  private _isMob: boolean;
  gold: Gold;
  xp: Experience;
  attrPoints: number;

  constructor(
    name: string,
    attrValues: AttributesProps,
    skills: Skill[] = [],
    isMob: boolean = false,
    gold: number = 0,
    xp: number = 0,
    attrPoints: number = 0,
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

  // this method needs to go a factory
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

  public gainRewards(rewards: MobRewards): void {
    this.gold.add(rewards.gold);
    this.gainXP(rewards.xp);
  }

  private gainXP(amount: number): void {
    const oldLevel = this.xp.level;
    this.xp.gain(amount);
    const newLevel = this.xp.level;

    if (newLevel > oldLevel) {
      this.onLevelUp(oldLevel, newLevel);
    }
  }

  private onLevelUp(oldLevel: number, newLevel: number): void {
    this.attrPoints += (newLevel - oldLevel) * ATTR_POINTS_PER_LEVEL;
  }

  public increaseAttr(attribute: AttributeKey, amount: number): void {
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

  public isMob(): boolean {
    return this._isMob;
  }

  public initCombatState(): void {
    if (this.combatState) return;
    this.combatState = new CombatState(this.stats, this.attributes);
  }

  public finishCombatState(): void {
    this.combatState = null;
  }

  public getSkillById(id: string): Skill {
    const skill = this.skills.find((s) => s.id === id);
    if (!skill) throw new Error(`Skill ${id} not found`);
    return skill;
  }

  public isDead(): boolean {
    return this.combatState?.isDead() ?? false;
  }

  public startTurn(): void {
    this.turnSystem.startTurn();
  }

  public endTurn(): void {
    this.turnSystem.endTurn();
  }
}
