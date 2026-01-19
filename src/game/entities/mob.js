import Character from "src/game/entities/character";
/*
normal: this is mobs for encounters and farming in world encounters
rare:   rare mobs are difficult to find, they normally drops good rewards
elite: its a "normal mobs" in DUNGEONS encounters, but have 50% more stats than a normal mob
bosses: its a final encounter of the dungeon, with 100% more stats than a normal mob
*/
VALID_TYPES = ["normal", "rare", "elite", "boss"];

VALID_ARCHETYPES = ["humanoid", "beast", "demon", "dragon", "fairy"];

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
    if (!VALID_TYPES.includes(type)) {
      throw new Error("Invalid type");
    }
    if (!VALID_ARCHETYPES.includes(archetype)) {
      throw new Error("Invalid archetype");
    }
    super(name, attrValues, skills, true);
    this.id = id;
    this.type = type;
    this.archetype = archetype;
    this.description = description;
  }
}
