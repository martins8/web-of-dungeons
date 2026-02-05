/* classe that will be return the object which front gonna use to show combat data
need to implement a return object with more informative data, not just a simple string. 
*/

export interface AttackPayload {
  source: { name: string };
  target: { name: string };
  damage: number;
  isCritical: boolean;
  damageType: "physical" | "magical" | string;
}

export interface HealPayload {
  source: { name: string };
  heal: number;
}

export interface SimpleTargetPayload {
  target: { name: string };
}

export interface DotHotPayload {
  target: { name: string };
  amount: number;
}

export interface DrawPayload {
  source: { name: string };
  target: { name: string };
}

export type EventPayload =
  | AttackPayload
  | HealPayload
  | SimpleTargetPayload
  | DotHotPayload
  | DrawPayload
  | any;

export interface CombatEvent {
  type:
    | "ATTACK"
    | "HEAL"
    | "EVADE"
    | "DOT_TICK"
    | "HOT_TICK"
    | "DEATH"
    | "DEATH_BY_DOT"
    | "DRAW";
  payload: EventPayload;
}

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
        return this.evade(payload as { source: { name: string }; target: { name: string } });

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
    let text = `${source.name} atacou ${target.name} causando ${damage}`;

    text += damageType === "physical" ? "⚔️" : "✨";

    if (isCritical) text += "💥";

    text += "\n";
    return text;
  }

  static heal({ source, heal }: HealPayload): string {
    return `${source.name} se curou em ${heal}💚\n`;
  }

  static evade({
    source,
    target,
  }: {
    source: { name: string };
    target: { name: string };
  }): string {
    return `${source.name} esquivou do ataque de ${target.name} 🏃‍♂️\n`;
  }

  static dot({ target, amount }: DotHotPayload): string {
    return `${target.name} sofreu ${amount}🩸 de dano contínuo\n`;
  }

  static hot({ target, amount }: DotHotPayload): string {
    return `${target.name} recuperou ${amount}💚\n`;
  }

  static death({ target }: SimpleTargetPayload): string {
    return `${target.name} foi morto em combate ⚰️\n`;
  }

  static deathByDot({ target }: SimpleTargetPayload): string {
    return `${target.name} morreu sangrando ⚰️\n`;
  }

  static draw({ source, target }: DrawPayload): string {
    return `Ocorreu um empate entre ${source.name} e ${target.name}`;
  }
}

