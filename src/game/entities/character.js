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

  doPhysicalAtk() {
    const damage = this.stats.pDmg;
    return damage;
  }

  reducePhysicalAtk() {
    const reduceValue = Math.floor(this.stats.pDef * 0.3);
    return reduceValue;
  }

  takePhysicalAtk(damageTaken) {
    const reduceValue = this.reducePhysicalAtk();
    const damageComing =
      damageTaken > reduceValue ? Math.floor(damageTaken - reduceValue) : 0;
    this.health.takeDamage(damageComing);
  }

  isDead() {
    const die = !this.health.isAlive() ? true : false;
    return die;
  }
}
