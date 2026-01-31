import Combat from "src/game/systems/combat";
import EncounterSystem from "src/game/systems/encounterSystem";
import SeedRNG from "src/game/rng/seedRNG";
import ActionResult from "src/game/value-objects/actionResult";

export default class EncounterCombat {
  constructor(player, encounterDefinition, { rng } = {}) {
    this.player = player;

    this.rng = rng ?? new SeedRNG(Date.now());

    this.encounterSystem = new EncounterSystem(encounterDefinition, {
      rng: this.rng,
    });

    this.mobs = [];
    this.currentCombatIndex = 0;
    this.currentCombat = null;

    this.finished = false;
    this.log = "";
  }

  start() {
    this.player.initCombatState();
    this.mobs = this.encounterSystem.generate();
    this.currentCombatIndex = 0;
    this.finished = false;
    this.log = "";

    this.startNextCombat();
  }

  startNextCombat() {
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
    this.log += this.currentCombat.combatLog;
  }

  performAction(skillId) {
    if (this.finished === true) {
      return ActionResult.failure("ENCOUNTER_FINISHED");
    }

    const result = this.currentCombat.performAction(skillId);

    // Handle both success and failure results
    if (result.isFailure()) {
      return result;
    }

    if (result.data) {
      this.log += result.data;
    }

    //if combat instance has finished
    if (this.currentCombat.finished) {
      this.currentCombat.end();

      if (this.player.combatState.isDead()) {
        this.finished = true;
        return ActionResult.failure("PLAYER_DEAD");
      }
      // 🔥 decisão importante de design:
      // resetar apenas estados de combate, não HP base
      //aqui está resetando tudo

      this.currentCombatIndex++;
      this.startNextCombat();
    }

    return result;
  }

  end() {
    if (this.finished === true) {
      this.player.finishCombatState();
      return ActionResult.success(null, "ENCOUNTER_FINISHED");
    } else {
      return ActionResult.failure("ENCOUNTER_NOT_FINISHED");
    }
  }
}
