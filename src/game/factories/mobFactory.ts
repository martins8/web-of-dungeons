import Mob from "../entities/mob";
import { mobDefinitions } from "src/game/dataLists/mob/normal";
import { skillRegistry } from "src/game/dataLists/skills/register";
import type Skill from "src/game/value-objects/skill";

export default class MobFactory {
  static fromMobId(id: string): Mob {
    const def = mobDefinitions[id];

    if (!def) {
      throw new Error(`Mob ${id} not found`);
    }

    const skills: Skill[] = def.skills.map(
      (skillId) => skillRegistry[skillId],
    ) as Skill[];

    return new Mob(
      def.name,
      def.attributes,
      skills,
      id,
      def.type as any,
      def.archetype as any,
      def.description,
      def.rewards,
    );
  }
}

