// skillRegistry.js
import physicalSkillsList from "src/game/dataLists/skills/physical/actionSkillsList";
import magicalSkillsList from "src/game/dataLists/skills/magic/list";
import buffSkills from "src/game/dataLists/skills/buffList";

const allSkills = [...physicalSkillsList, ...magicalSkillsList, ...buffSkills];

export const skillRegistry = Object.fromEntries(
  allSkills.map((skill) => [skill.id, skill]),
);
