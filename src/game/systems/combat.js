import CombatResolve from "src/game/services/combatResolve";
import CombatTexts from "src/game/texts/combatTexts";
import SeedRNG from "src/game/rng/seedRNG";

export default class Combat {
  constructor(player, enemy, { rng } = {}) {
    this.player = player;
    this.enemy = enemy;

    this.combatResolve = new CombatResolve();
    this.combatTexts = new CombatTexts();

    // RNG contract:
    // - rollPercent(): number (0–100)
    this.rng = rng ?? new SeedRNG(Date.now());
    if (rng && typeof rng.rollPercent !== "function") {
      throw new Error("Invalid RNG: rollPercent() not found");
    }
    this.turnOrder = [];
    this.currentTurnIndex = 0;
    this.combatLog = this.initialLog();
    this.finished = false;
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

  start() {
    this.player.critSystem.reset();
    this.enemy.critSystem.reset();
    this.player.evadeSystem.reset();
    this.enemy.evadeSystem.reset();

    this.turnOrder = this.decideTurnOrder();
    this.currentTurnIndex = 0;

    this.getCurrentAttacker().startTurn();

    this.combatLog = this.initialLog();
  }

  getCurrentAttacker() {
    return this.turnOrder[this.currentTurnIndex];
  }

  getCurrentDefender() {
    return this.turnOrder[(this.currentTurnIndex + 1) % 2];
  }

  performAction(skillId) {
    if (this.finished) return null;

    const attacker = this.getCurrentAttacker();
    const defender = this.getCurrentDefender();

    //after implements UI remove this line and put the skill on the the parameter
    const skill = attacker.getSkillById(skillId);

    const turnResult = attacker.turnSystem.useTurn(skill);

    if (!turnResult.ok) {
      return turnResult; // user interface decide o que fazer
    }

    const result = this.combatResolve.action(attacker, defender, skill, {
      rng: this.rng,
      critSystem: attacker.critSystem,
      evadeSystem: defender.evadeSystem,
    });

    this.combatLog += this.combatTexts.fromResult(result);

    if (result.isDead) {
      this.finished = true;
      return result;
    }

    if (attacker.turnSystem.actionsOnTurn === 0) {
      attacker.endTurn();
      this.advanceTurn();
      this.getCurrentAttacker().startTurn();
    }

    return result;
  }

  advanceTurn() {
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
  }
}
