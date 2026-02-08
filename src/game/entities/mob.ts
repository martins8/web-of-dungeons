import Character from "src/game/entities/character";
import type { AttributesProps } from "src/game/value-objects/attributes";
import type Skill from "src/game/value-objects/skill";

/*
normal: this is mobs for encounters and farming in world encounters
rare:   rare mobs are difficult to find, they normally drops good rewards
elite: its a "normal mobs" in DUNGEONS encounters, but have 50% more stats than a normal mob
bosses: its a final encounter of the dungeon, with 100% more stats than a normal mob
*/

export const VALID_TYPES = ["normal", "rare", "elite", "boss"] as const;
export type MobType = (typeof VALID_TYPES)[number];

export const VALID_ARCHETYPES = [
  "humanoid",
  "beast",
  "demon",
  "undead",
  "dragon",
  "fairy",
] as const;
export type MobArchetype = (typeof VALID_ARCHETYPES)[number];

export interface MobRewards {
  xp: number;
  gold: number;
  [key: string]: unknown;
}

export default class Mob extends Character {
  id: string;
  type: MobType;
  archetype: MobArchetype;
  description: string;
  rewards: MobRewards;

  constructor(
    name: string,
    attrValues: AttributesProps,
    skills: Skill[] = [],
    id: string,
    type: MobType,
    archetype: MobArchetype,
    description: string = "Dont have any description about this enemy",
    rewards: MobRewards,
  ) {
    if (!VALID_TYPES.includes(type)) {
      throw new Error("Invalid type");
    }
    if (!VALID_ARCHETYPES.includes(archetype)) {
      throw new Error("Invalid archetype");
    }
    super({ name, attrValues, skills, isMob: true });
    this.id = id;
    this.type = type;
    this.archetype = archetype;
    this.description = description;
    this.rewards = rewards;
  }
}
