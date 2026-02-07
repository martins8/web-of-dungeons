import type Effect from "./effect";
import type { StatKey } from "./stats";

export type SkillType = "offensive" | "support" | "defensive" | "moviment";

export type SkillReach = "melee" | "range" | "global";

export type DamageType = "physical" | "magical";

export interface SkillDamageDefinition {
  typeDamage: DamageType;
  scaling: Partial<Record<StatKey, number>>;
}

export interface SkillHealDefinition {
  scaling: Partial<Record<StatKey, number>>;
}

export interface SkillMetadata {
  name: string;
  text: string;
  rarity: string;
  // future extra metadata is allowed
  [key: string]: unknown;
}

export interface SkillParams {
  id: string;
  rank: number;
  typeSkill: SkillType | string;
  reach: SkillReach | string;
  cooldown: number;
  heal?: SkillHealDefinition | null;
  damage?: SkillDamageDefinition | null;
  effects?: Effect | null;
  metadata: SkillMetadata;
}

export default class Skill {
  id: string;
  rank: number;
  typeSkill: SkillType | string;
  reach: SkillReach | string;
  cooldown: number;
  damage: SkillDamageDefinition | null;
  heal: SkillHealDefinition | null;
  effects: Effect | null;
  metadata: SkillMetadata;

  /**
   * Represents a skill usable in combat.
   */
  constructor({
    id,
    rank,
    typeSkill,
    reach,
    cooldown,
    heal = null,
    damage = null,
    effects = null,
    metadata,
  }: SkillParams) {
    this.id = id;
    this.rank = rank;
    this.typeSkill = typeSkill;
    this.reach = reach;
    this.cooldown = cooldown;
    this.damage = damage ?? null;
    this.heal = heal ?? null;
    this.effects = effects ?? null;
    this.metadata = metadata;
  }

  get name(): string {
    return this.metadata.name;
  }
}

