import CombatResolve from "src/game/services/combatResolve";
import CombatTexts from "src/game/texts/combatTexts";

export default class Combat {
  constructor(
    player,
    enemy,
    combatResolve = new CombatResolve(),
    combatTexts = new CombatTexts(),
  ) {
    this.player = player;
    this.enemy = enemy;
    this.combatResolve = combatResolve;
    this.combatTexts = combatTexts;

    this.playerInit = player.stats.init;
    this.enemyInit = enemy.stats.init;
    this.combatLog = "";
  }

  startCombat() {
    let damage;
    const first = this.playerInit > this.enemyInit ? this.player : this.enemy;
    const second = first === this.player ? this.enemy : this.player;

    while (!this.player.isDead() && !this.enemy.isDead()) {
      damage = this.combatResolve.physical(first, second);
      this.combatLog += this.combatTexts.physical(damage, first, second);

      if (second.isDead()) break;

      damage = this.combatResolve.physical(second, first);
      this.combatLog += this.combatTexts.physical(damage, second, first);
    }
  }
}
