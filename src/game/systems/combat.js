import CombatResolve from "src/game/services/combatResolve";
import EventTexts from "src/game/texts/eventTexts";
import EffectSystem from "src/game/systems/effectSystem";
import SeedRNG from "src/game/rng/seedRNG";
import EventFactory from "src/game/factories/eventFactory";

export default class Combat {
  constructor(player, enemy, { rng } = {}) {
    this.player = player;
    this.enemy = enemy;

    this.combatResolve = new CombatResolve();

    // RNG contract:
    // - rollPercent(): number (0–100)
    this.rng = rng ?? new SeedRNG(Date.now());
    if (rng && typeof rng.rollPercent !== "function") {
      throw new Error("Invalid RNG: rollPercent() not found");
    }
    this.turnOrder = [];
    this.currentTurnIndex = 0;

    /* this.state = "FINISHED"; // RUNNING | FINISHED */
    this.finished = false;
  }
  initialLog() {
    return `${this.player.name}: ${this.player.combatState.currentHp} ❤️ ${this.enemy.name}: ${this.enemy.combatState.currentHp} ❤️\n`;
  }

  decideTurnOrder() {
    if (this.player.stats.init >= this.enemy.stats.init) {
      return [this.player, this.enemy];
    }
    return [this.enemy, this.player];
  }
  getCurrentAttacker() {
    return this.turnOrder[this.currentTurnIndex];
  }

  getCurrentDefender() {
    return this.turnOrder[(this.currentTurnIndex + 1) % 2];
  }

  start() {
    //reset rng systems
    this.player.critSystem.reset();
    this.enemy.critSystem.reset();
    this.player.evadeSystem.reset();
    this.enemy.evadeSystem.reset();
    //initialize combat states
    this.player.initCombatState();
    this.enemy.initCombatState();

    this.combatLog = this.initialLog();
    //decide turn order
    this.turnOrder = this.decideTurnOrder();
    this.currentTurnIndex = 0;
    //catch the first attacker and start her turn
    this.getCurrentAttacker().startTurn();
    //initialize combat string log
    this.combatLog = this.initialLog();
  }
  /*
  1 turn has 2 actions (for now)
  design decision: tick dot/hot only one time per turn 
                   tick cooldown in every action
  */
  /*
 this method ticks the effects timers and pass a boolean to 
 combatResolve action method where the tick damage/heal is calculated
 */
  tickDotAndHot(attacker, defender) {
    let ticked = false;
    if (attacker.turnSystem.actionsOnTurn === 2) {
      attacker.combatState.tickEffects();
      defender.combatState.tickEffects();
      ticked = true;
    }
    return ticked;
  }
  //method called by UI when player or enemy
  performAction(skillId) {
    if (this.finished) return null;
    //tick cooldowns every action
    this.player.combatState.tickCooldowns();
    this.enemy.combatState.tickCooldowns();
    //catch attacker and defender
    const attacker = this.getCurrentAttacker();
    const defender = this.getCurrentDefender();

    //tick dot/hot one time per turn
    const ticked = this.tickDotAndHot(attacker, defender);

    //after implements UI remove this line and put the skill on the the parameter
    const skill = attacker.getSkillById(skillId);

    //check if skill is on cooldown
    if (attacker.combatState.isOnCooldown(skill)) {
      return { ok: false, reason: "SKILL_ON_COOLDOWN" };
    }

    //use turn of the attacker.  (2 action per turn)
    const turnResult = attacker.turnSystem.useTurn(skill);
    if (!turnResult.ok) {
      return turnResult; // user interface decide o que fazer
    }

    //check if skill has buff or debuff effect and apply it before action resolve
    if (skill.effects) {
      const effectSystem = new EffectSystem(skill.effects);
      const target =
        skill.effects.target === "self"
          ? attacker.combatState
          : defender.combatState;
      //effects on cast. (example: if is a debuff the tick just happen on combatResolve)
      effectSystem.apply(target);
    }

    //resolve action in combatResolve service
    const result = this.combatResolve.action(
      attacker,
      defender,
      skill,
      ticked,
      {
        rng: this.rng,
        critSystem: attacker.critSystem,
        evadeSystem: defender.evadeSystem,
      },
    );
    //set skill on cooldown
    attacker.combatState.setCooldown(skill);
    //increment combat log
    result.events = EventFactory.fromActionResult(result);
    const resultText = EventTexts.fromEvents(result.events);
    this.combatLog += resultText;
    //check if defender is dead
    if (result.isDead) {
      this.finished = true;
      return resultText;
    }

    //check if attacker turn is over (2 actions per turn)
    if (attacker.turnSystem.actionsOnTurn === 0) {
      attacker.endTurn();
      this.advanceTurn();
      this.getCurrentAttacker().startTurn();
    }

    return resultText;
  }

  advanceTurn() {
    //advance turn index
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
  }

  end() {
    if (this.finished === true) {
      this.player.finishCombatState();
      this.enemy.finishCombatState();
    } else {
      return { ok: false, reason: "COMBAT_NOT_FINISHED" };
    }
  }
}
