import StatsCalculator from "src/game/services/statsCalculator";
import Skill from "./skill";

export default class BuffSkill extends Skill {
  constructor({
    id,
    rank,
    name,
    typeSkill,
    reach,
    text,
    rarity,
    typeBuff,
    buff,
    duration,
  }) {
    super({ id, rank, name, typeSkill, reach, text, rarity });
    this.typeBuff = typeBuff;
    this.buff = buff;
    this.duration = duration;
  }

  useBuffSkill(baseAttributes, baseStats) {
    const newStatsWithBuff =
      this.typeBuff === "attribute"
        ? StatsCalculator.applyAttrBuff(baseAttributes, this.buff)
        : StatsCalculator.applyStatsBuff(baseStats, this.buff);
    return [this.duration, newStatsWithBuff];
  }
}
