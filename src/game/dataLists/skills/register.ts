// skillRegistry
/**
 * Central registry mapping skill id -> Skill instance.
 * This file aggregates skill lists (physical, magical, buffs) and builds
 * an object for O(1) lookup when resolving skill ids in factories or
 * during combat.
 */
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";
import magicalSkillsList from "src/game/dataLists/skills/magic/list";
import buffSkills from "src/game/dataLists/skills/buffList";
import type Skill from "src/game/value-objects/skill";

const allSkills: Skill[] = [
  ...physicalSkillsList,
  ...magicalSkillsList,
  ...buffSkills,
];

export const skillRegistry: Record<string, Skill> = Object.fromEntries(
  allSkills.map((skill) => [skill.id, skill]),
) as Record<string, Skill>;
