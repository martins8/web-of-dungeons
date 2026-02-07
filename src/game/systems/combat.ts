import CombatResolve from "src/game/services/combatResolve";
import EventTexts from "src/game/texts/eventTexts";
import EffectSystem from "src/game/systems/effectSystem";
import SeedRNG, { type RandomSource } from "src/game/rng/seedRNG";
import EventFactory from "src/game/factories/eventFactory";
import ActionResult from "src/game/value-objects/actionResult";
import type Character from "src/game/entities/character";
import type Skill from "src/game/value-objects/skill";
import { Events } from "../value-objects/combatActionResult";

export interface CombatOptions {
  rng?: RandomSource;
}

/**
 * Combat orchestrates a duel between two entities (player and enemy).
 * It is responsible for turn order, ticking cooldowns/effects and
 * delegating resolution details to `CombatResolve`.
 *
 * Public methods:
 * - `start()` initializes combat
 * - `performAction(skillId)` executes an action from the current attacker
 * - `end()` finalizes the combat
 */

export interface CombatResult {
  resultText: string;
  events: Events[];
}

export default class Combat {
  player: Character;
  enemy: Character;
  combatResolve: CombatResolve;
  rng: RandomSource;
  turnOrder: Character[];
  currentTurnIndex: number;
  finished: boolean;
  combatLog: string;

  constructor(
    player: Character,
    enemy: Character,
    { rng }: CombatOptions = {},
  ) {
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
    this.combatLog = "";
  }

  initialLog(): string {
    return `${this.player.name}: ${this.player.combatState?.currentHp ?? this.player.health.currentHp} ❤️ ${this.enemy.name}: ${this.enemy.combatState?.currentHp ?? this.enemy.health.currentHp} ❤️\n`;
  }

  decideTurnOrder(): Character[] {
    if (this.player.stats.init >= this.enemy.stats.init) {
      return [this.player, this.enemy];
    }
    return [this.enemy, this.player];
  }

  getCurrentAttacker(): Character {
    return this.turnOrder[this.currentTurnIndex];
  }

  getCurrentDefender(): Character {
    return this.turnOrder[(this.currentTurnIndex + 1) % 2];
  }

  start(): void {
    // reset rng systems
    this.player.critSystem.reset();
    this.enemy.critSystem.reset();
    this.player.evadeSystem.reset();
    this.enemy.evadeSystem.reset();
    // initialize enemy combat state
    if (!this.player.combatState || this.player.combatState === null) {
      this.player.initCombatState();
    }
    if (!this.enemy.combatState || this.enemy.combatState === null) {
      this.enemy.initCombatState();
    }
    this.combatLog = this.initialLog();
    // decide turn order
    this.turnOrder = this.decideTurnOrder();
    this.currentTurnIndex = 0;
    // catch the first attacker and start her turn
    this.getCurrentAttacker().startTurn();
    // initialize combat string log
    this.combatLog = this.initialLog();
  }

  /*
  1 turn has 2 actions (for now)
  design decision: tick dot/hot only one time per turn 
                   tick cooldown in every action
  */

  tickDotAndHot(attacker: Character, defender: Character): boolean {
    let ticked = false;
    if (attacker.turnSystem.actionsOnTurn === 2) {
      attacker.combatState?.tickEffects();
      defender.combatState?.tickEffects();
      ticked = true;
    }
    return ticked;
  }

  // method called by UI when player or enemy
  performAction(skillId: string): ActionResult<any> {
    if (this.finished) {
      return ActionResult.failure("COMBAT_FINISHED");
    }
    // tick cooldowns every action
    this.player.combatState?.tickCooldowns();
    this.enemy.combatState?.tickCooldowns();
    // catch attacker and defender
    const attacker = this.getCurrentAttacker();
    const defender = this.getCurrentDefender();

    // tick dot/hot one time per turn
    const ticked = this.tickDotAndHot(attacker, defender);

    const skill: Skill = attacker.getSkillById(skillId);

    // check if skill is on cooldown
    if (attacker.combatState && attacker.combatState.isOnCooldown(skill)) {
      return ActionResult.failure("SKILL_ON_COOLDOWN");
    }

    // use turn of the attacker.  (2 action per turn)
    const turnResult = attacker.turnSystem.useTurn(skill);
    if (turnResult.isFailure()) {
      return turnResult; // user interface decide o que fazer
    }

    // check if skill has buff / debuff effect and target self / enemy
    let effectSystem: EffectSystem | undefined;
    if (skill.effects) {
      effectSystem = new EffectSystem(skill.effects as any);
    }

    // resolve action in combatResolve service
    const result = this.combatResolve.action(
      attacker as any,
      defender as any,
      skill,
      ticked,
      effectSystem,
      {
        rng: this.rng,
        critSystem: attacker.critSystem,
        evadeSystem: defender.evadeSystem,
      },
    );
    // set skill on cooldown
    attacker.combatState?.setCooldown(skill);
    // increment combat log
    (result as any).events = EventFactory.fromActionResult(result);
    const resultText = EventTexts.fromEvents((result as any).events);
    this.combatLog += resultText;
    const resultPayload: CombatResult = {
      events: (result as any).events ?? [],
      resultText,
    };
    // check if have a dead or a draw
    if (result.isDead || result.isDraw) {
      this.finished = true;
      return ActionResult.success(resultPayload);
    }

    // check if attacker turn is over (2 actions per turn)
    if (attacker.turnSystem.actionsOnTurn === 0) {
      attacker.endTurn();
      this.advanceTurn();
      this.getCurrentAttacker().startTurn();
    }

    return ActionResult.success(resultPayload);
  }

  advanceTurn(): void {
    // advance turn index
    this.currentTurnIndex = (this.currentTurnIndex + 1) % this.turnOrder.length;
  }

  end(): { ok: boolean; reason?: string } | void {
    if (this.finished === true) {
      this.player.combatState?.resetEffects();
      this.enemy.finishCombatState();
    } else {
      return { ok: false, reason: "COMBAT_NOT_FINISHED" };
    }
  }
}
