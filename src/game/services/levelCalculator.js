/**
 * XP para subir = base + (level - 1) * increment
 * Lv 1 → 2 = 100 XP
 * Lv 2 → 3 = 150 XP
 * Lv 3 → 4 = 200 XP
 * Lv 4 → 5 = 250 XP
 */

const BASE_XP = 100;
const XP_INCREMENT = 50;

export default class LevelCalculator {
  static fromXP(xp) {
    let level = 1;
    let xpToNext = BASE_XP;

    while (xp >= xpToNext) {
      xp -= xpToNext;
      level++;
      xpToNext += XP_INCREMENT;
    }

    return level;
  }
}
