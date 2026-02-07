/* classe that will be return the object which front gonna use to show combat data
need to implement a return object with more informative data, not just a simple string. 
*/
import type { CombatEvent } from "../types/events.js";
import type {
  AttackPayload,
  HealPayload,
  DotHotPayload,
  SimpleTargetPayload,
  DrawPayload,
} from "../types/events.js";

export default class EventTexts {
  static fromEvents(events: CombatEvent[]): string {
    return events.map((event) => this.fromEvent(event)).join("");
  }

  static fromEvent(event: CombatEvent): string {
    const payload = event.payload as any;
    switch (event.type) {
      case "ATTACK":
        return this.attack(payload as AttackPayload);

      case "HEAL":
        return this.heal(payload as HealPayload);

      case "EVADE":
        return this.evade(
          payload as { source: { name: string }; target: { name: string } },
        );

      case "DOT_TICK":
        return this.dot(payload as DotHotPayload);

      case "HOT_TICK":
        return this.hot(payload as DotHotPayload);

      case "DEATH":
        return this.death(payload as SimpleTargetPayload);

      case "DEATH_BY_DOT":
        return this.deathByDot(payload as SimpleTargetPayload);

      case "DRAW":
        return this.draw(payload as DrawPayload);

      default:
        return "";
    }
  }

  static attack({
    source,
    target,
    damage,
    isCritical,
    damageType,
  }: AttackPayload): string {
    const sourceName = typeof source === "object" ? source.name : source;
    const targetName = typeof target === "object" ? target.name : target;
    let text = `${sourceName} atacou ${targetName} causando ${damage}`;

    text += damageType === "physical" ? "⚔️" : "✨";

    if (isCritical) text += "💥";

    text += "\n";
    return text;
  }

  static heal({ source, heal }: HealPayload): string {
    const sourceName = typeof source === "object" ? source.name : source;
    return `${sourceName} se curou em ${heal}💚\n`;
  }

  static evade({
    source,
    target,
  }: {
    source: string | { name: string };
    target: string | { name: string };
  }): string {
    const sourceName = typeof source === "object" ? source.name : source;
    const targetName = typeof target === "object" ? target.name : target;
    return `${sourceName} esquivou do ataque de ${targetName} 🏃‍♂️\n`;
  }

  static dot({ target, amount }: DotHotPayload): string {
    const targetName = typeof target === "object" ? target.name : target;
    return `${targetName} sofreu ${amount}🩸 de dano contínuo\n`;
  }

  static hot({ target, amount }: DotHotPayload): string {
    const targetName = typeof target === "object" ? target.name : target;
    return `${targetName} recuperou ${amount}💚\n`;
  }

  static death({ target }: SimpleTargetPayload): string {
    const targetName = typeof target === "object" ? target.name : target;
    return `${targetName} foi morto em combate ⚰️\n`;
  }

  static deathByDot({ target }: SimpleTargetPayload): string {
    const targetName = typeof target === "object" ? target.name : target;
    return `${targetName} morreu sangrando ⚰️\n`;
  }

  static draw({ source, target }: DrawPayload): string {
    const sourceName = typeof source === "object" ? source.name : source;
    const targetName = typeof target === "object" ? target.name : target;
    return `Ocorreu um empate entre ${sourceName} e ${targetName}`;
  }
}
