export default class Enemy {
  constructor(name, attrValues) {
    this.validateName(name);
    this.name = name;
    this.attributes = new Attributes(attrValues);
    this.stats = new StatsCalculator(this.attributes);
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
