import Mob from "../entities/mob";
import { mobDefinitions } from "src/game/dataLists/mob/normal";
import register from "src/game/dataLists/skills/physical/actionSkillsList";

export default class MobFactory {
  static fromMobId(id) {
    const def = mobDefinitions[id];

    if (!def) {
      throw new Error(`Mob ${id} not found`);
    }

    const skills = def.skills.map((skillId) => register.skillRegistry[skillId]);

    return new Mob(
      def.name,
      def.attributes,
      skills,
      id,
      def.type,
      def.archetype,
      def.description,
    );
  }
}
