import Character from "src/game/entities/character";
import utils from "src/game/utils/utils";

/* 
  VALID_TYPES = ["normal", "elite", "boss"];
  VALID_ARCHETYPES = ["humanoid", "beast", "demon", "dragon", "fairy"];
*/

export default class Mob extends Character {
  constructor(
    name,
    attrValues,
    skills = [],
    id,
    type,
    archetype,
    description = "Dont have any description about this enemy",
  ) {
    super(name, attrValues, skills, true);
    this.id = id;
    this.type = type;
    this.archetype = archetype;
    this.description = description;
  }
}
