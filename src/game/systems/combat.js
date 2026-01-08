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

    this.playerInit = this.player.stats.init;
    this.enemyInit = this.enemy.stats.init;
    this.combatLog = `${this.player.name}: ${this.player.health.maxHp}❤️
      ${this.enemy.name}: ${this.enemy.health.maxHp}❤️\n`;
  }

  startCombat() {
    let damage;
    const first = this.playerInit > this.enemyInit ? this.player : this.enemy;
    const second = first === this.player ? this.enemy : this.player;

    while (!this.player.isDead() && !this.enemy.isDead()) {
      damage = this.combatResolve.physical(first, second);
      this.combatLog += this.combatTexts.physical(damage, first, second);

      if (second.isDead()) {
        this.combatLog += this.combatTexts.die(second);
        break;
      }

      damage = this.combatResolve.physical(second, first);
      this.combatLog += this.combatTexts.physical(damage, second, first);

      if (first.isDead()) {
        this.combatLog += this.combatTexts.die(first);
        break;
      }
    }
  }
}
