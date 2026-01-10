import CombatResolve from "src/game/services/combatResolve";
import CombatTexts from "src/game/texts/combatTexts";
import SeedRNG from "src/game/rng/seedRNG";

export default class Combat {
  constructor(
    player,
    enemy,
    combatResolve = new CombatResolve(),
    combatTexts = new CombatTexts(),
  ) {
    //combatants
    this.player = player;
    this.enemy = enemy;
    //combat
    this.combatResolve = combatResolve;
    this.combatTexts = combatTexts;
    this.combatLog = this.initialLog();
    //infra seeed
    this.rng = new SeedRNG(Date.now());
  }

  initialLog() {
    return `${this.player.name}: ${this.player.health.maxHp} ❤️ ${this.enemy.name}: ${this.enemy.health.maxHp} ❤️\n`;
  }

  decideTurnOrder() {
    if (this.player.stats.init >= this.enemy.stats.init) {
      return [this.player, this.enemy];
    }
    return [this.enemy, this.player];
  }

  executeTurn(attacker, defender) {
    const result = this.combatResolve.physical(attacker, defender, {
      rng: this.rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });
    this.combatLog += this.combatTexts.fromResult(result);
    return result.isDead;
  }

  startCombat() {
    this.player.critSystem.reset();
    this.player.evadeSystem.reset();
    this.enemy.critSystem.reset();
    this.enemy.evadeSystem.reset();
    const [first, second] = this.decideTurnOrder();

    while (true) {
      if (this.executeTurn(first, second)) break;
      if (this.executeTurn(second, first)) break;
    }

    return this.combatLog;
  }
}
