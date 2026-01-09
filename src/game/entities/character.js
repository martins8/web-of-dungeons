import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";
import utils from "src/game/utils/utils";

export default class Character {
  constructor(name, attrValues) {
    utils.validateName(name);
    this.name = name;
    this.attributes = new Attributes(attrValues);
    this.stats = StatsCalculator.calculate(this.attributes);
    this.health = new Health(this.stats.maxHp);
  }

  takeDamage(amount) {
    this.health.takeDamage(amount);
  }

  isDead() {
    return !this.health.isAlive();
  }
}
