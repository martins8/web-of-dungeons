/*classe that will be return the object which front gonna use to show combat data
need to implement a return object with more informative data, not just a simple string. 
*/

export default class EventTexts {
  static fromEvents(events) {
    return events.map((event) => this.fromEvent(event)).join("");
  }

  static fromEvent(event) {
    const payload = event.payload;
    switch (event.type) {
      case "ATTACK":
        return this.attack(payload);

      case "EVADE":
        return this.evade(payload);

      case "DOT_TICK":
        return this.dot(payload);

      case "HOT_TICK":
        return this.hot(payload);

      case "DEATH":
        return this.death(payload);

      default:
        return "";
    }
  }

  static attack({ source, target, damage, isCritical, damageType }) {
    let text = `${source.name} atacou ${target.name} causando ${damage}`;

    text += damageType === "physical" ? "⚔️" : "✨";

    if (isCritical) text += "💥";

    text += "\n";
    return text;
  }

  static evade({ source, target }) {
    return `${source.name} esquivou do ataque de ${target.name} 🏃‍♂️\n`;
  }

  static dot({ target, amount }) {
    return `${target.name} sofreu ${amount}🩸 de dano contínuo\n`;
  }

  static hot({ target, amount }) {
    return `${target.name} recuperou ${amount}❤️\n`;
  }

  static death({ target }) {
    return `${target.name} foi morto em combate ⚰️\n`;
  }
}
