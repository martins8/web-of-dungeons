import StatsCalculator from "src/game/services/statsCalculator";
import Attributes from "src/game/value-objects/attributes";
import Health from "src/game/gcomponents/health";

export default class Player {
  constructor(name, attrValues) {
    this.validateName(name);
    this.name = name;
    this.attributes = new Attributes(attrValues);
    this.stats = StatsCalculator.calculate(this.attributes);
    this.health = new Health(this.stats.maxHp);
  }

  validateName(name) {
    if (typeof name !== "string") {
      throw new Error("Name must be a string");
    }
    if (name.trim().length === 0) {
      throw new Error("Name cannot be empty");
    }
    if (/\d/.test(name)) {
      throw new Error("Name cannot contain numbers");
    }
    if (/\s/.test(name)) {
      throw new Error("Name cannot contain spaces");
    }
  }
}
