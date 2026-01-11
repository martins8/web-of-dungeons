export default class Skill {
  constructor({ id, rank, name, typeSkill, reach, text, rarity }) {
    this.id = id;
    this.rank = rank;
    this.name = name;
    this.typeSkill = typeSkill; //"action", "buff", "movement"
    this.reach = reach;
    this.text = text;
    this.rarity = rarity;
  }
}
