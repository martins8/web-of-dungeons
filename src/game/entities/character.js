import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import CritSystem from "../rng/critSystem";
import EvadeSystem from "../rng/evadeSystem";
import utils from "src/game/utils/utils";

export default class Character {
  constructor(name, attrValues) {
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
  }

  takeDamage(amount) {
    this.health.takeDamage(amount);
  }

  isDead() {
    return !this.health.isAlive();
  }
}
