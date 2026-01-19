// skillRegistry.js
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";
import magicalSkillsList from "src/game/dataLists/skills/magic/list";

const allSkills = [...physicalSkillsList, ...magicalSkillsList];

export const skillRegistry = Object.fromEntries(
  allSkills.map((skill) => [skill.id, skill]),
);
