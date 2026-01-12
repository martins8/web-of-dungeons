export default class CombatState {
  constructor(character) {
    this.character = character;
    this.currentHp = character.stats.maxHp;
    this.buffs = [];
    this.debuffs = [];
    this.cc = {
      stunned: false,
      silencied: false,
      rooted: false,
      slowed: false,
    };
  }
}
