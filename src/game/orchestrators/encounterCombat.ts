import Combat from "src/game/systems/combat";
import EncounterSystem from "src/game/systems/encounterSystem";
import DropSystem from "src/game/systems/dropSystem";
import SeedRNG, { type RandomSource } from "src/game/rng/seedRNG";
import ActionResult from "src/game/value-objects/actionResult";
import decideSkill from "src/game/AI/normal";
import type Character from "src/game/entities/character";
import type { EncounterDefinition } from "src/game/systems/encounterSystem";
import type Mob from "../entities/mob";
import { Events } from "../value-objects/combatActionResult";

export interface EncounterCombatOptions {
  rng?: RandomSource;
}

export default class EncounterCombat {
  player: Character;
  rng: RandomSource;
  encounterSystem: EncounterSystem;
  dropSystem: DropSystem;
  mobs: Mob[];
  currentCombatIndex: number;
  currentCombat: Combat | null;
  finished: boolean;
  textLog: string;
  eventLog: Events[];

  constructor(
    player: Character,
    encounterDefinition: EncounterDefinition,
    { rng }: EncounterCombatOptions = {},
  ) {
    this.player = player;

    this.rng = rng ?? new SeedRNG(Date.now());

    this.encounterSystem = new EncounterSystem(encounterDefinition, {
      rng: this.rng,
    });

    this.dropSystem = new DropSystem(this.rng);

    this.mobs = [] as Mob[];
    this.currentCombatIndex = 0;
    this.currentCombat = null;

    this.finished = false;
    this.textLog = "";
    this.eventLog = [];
  }

  public start(): void {
    this.player.initCombatState();
    this.mobs = this.encounterSystem.generate() as Mob[];
    this.currentCombatIndex = 0;
    this.finished = false;
    this.textLog = "";
    this.eventLog = [];

    this.startNextCombat();
  }

  public startNextCombat(): ActionResult<null> {
    if (this.finished === true)
      return ActionResult.success(null, "ENCOUNTER_FINISHED");
    if (this.currentCombatIndex >= this.mobs.length) {
      this.finished = true;
      return ActionResult.success(null, "ENCOUNTER_FINISHED");
    }

    const enemy = this.mobs[this.currentCombatIndex];

    this.currentCombat = new Combat(this.player, enemy, {
      rng: this.rng,
    });

    this.currentCombat.start();
    this.textLog += this.currentCombat.combatLog;
    return ActionResult.success(null);
  }

  private isMobTurn(): boolean {
    if (!this.currentCombat) return false;
    return this.currentCombat.getCurrentAttacker().isMob();
  }

  public performAction(skillId: string): ActionResult<any> {
    let textLog = "";
    let events: Events[] = [];
    if (this.finished === true) {
      return ActionResult.failure("ENCOUNTER_FINISHED");
    }

    if (this.currentCombat && this.isMobTurn()) {
      let safety = 10;
      while (this.isMobTurn() && safety > 0) {
        const mob = this.currentCombat.getCurrentAttacker();
        const mobSkillId = decideSkill(mob, this.player);
        if (!mobSkillId) break;
        const mobResult = this.currentCombat.performAction(mobSkillId);
        if (mobResult.data.events) {
          events = events.concat(mobResult.data.events);
          textLog += mobResult.data.resultText;
        }
        safety -= 1;
      }
    }

    if (!this.currentCombat) {
      return ActionResult.failure("NO_COMBAT_RUNNING");
    }

    const result = this.currentCombat.performAction(skillId);

    // Handle both success and failure results
    if (result.isFailure()) {
      return result;
    }

    if (result.data.events) {
      textLog += result.data.resultText;
      events = events.concat(result.data.events);
      this.eventLog = this.eventLog.concat(events);
      this.textLog += textLog;
    }

    // if combat instance has finished
    if (this.currentCombat.finished) {
      this.currentCombat.end();

      if (this.player.combatState?.isDead()) {
        this.finished = true;
        return ActionResult.failure("PLAYER_DEAD");
      }
      // before enter in next combat, grant rewards
      const mob = this.mobs[this.currentCombatIndex];
      const dropResult = this.dropSystem.calculateDrops(mob.rewards.drops);
      this.player.gainRewards(mob.rewards, dropResult.items);
      result.data.rewards = {
        ...mob.rewards,
        droppedItems: dropResult.droppedIds,
      };

      this.currentCombatIndex++;
      this.startNextCombat();
    }

    return result;
  }

  public end(): ActionResult<null> {
    if (this.finished === true) {
      this.player.finishCombatState();
      return ActionResult.success(null, "ENCOUNTER_FINISHED");
    } else {
      return ActionResult.failure("ENCOUNTER_NOT_FINISHED");
    }
  }
}
