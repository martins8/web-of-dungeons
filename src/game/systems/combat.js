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

    this.combatLog = `${player.name}: ${player.health.maxHp}❤️
${enemy.name}: ${enemy.health.maxHp}❤️\n`;
  }

  startCombat() {
    const first =
      this.player.stats.init > this.enemy.stats.init ? this.player : this.enemy;

    const second = first === this.player ? this.enemy : this.player;

    while (true) {
      const result1 = this.combatResolve.physical(first, second);
      this.combatLog += this.combatTexts.fromResult(result1);

      if (result1.isDead) break;

      const result2 = this.combatResolve.physical(second, first);
      this.combatLog += this.combatTexts.fromResult(result2);

      if (result2.isDead) break;
    }
  }
}
