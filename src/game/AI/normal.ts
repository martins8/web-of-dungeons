// Normal mob AI (MVP)
// Strategy (simple):
// 1. Consider mob skills and ignore those on cooldown or blocked by CC.
// 2. If there is a healing skill (effectType === 'hot'), use it only when it will be effective
//    (i.e. mob missing HP > 0 and predicted heal > 0).
// 3. Otherwise pick the first available damaging/action skill.
// 4. If nothing available, returns null.

// The function expects `attacker` and `defender` to be `Character` instances
// used across the engine (they have `.skills`, `.combatState`, `.turnSystem`, `.stats`).

import type Character from "src/game/entities/character";
import type Skill from "src/game/value-objects/skill";
import type Effect from "src/game/value-objects/effect";
import type { StatsProps } from "src/game/value-objects/stats";

type MaybeCharacter = Character | null | undefined;

export default function decideSkill(
  attacker: MaybeCharacter,
  defender: MaybeCharacter = null,
): string | null {
  if (!attacker || !attacker.skills || attacker.skills.length === 0)
    return null;

  // helper to estimate HOT heal or DOT damage using combat state's effective stats
  const attackerStats: StatsProps =
    attacker.combatState?.getEffectiveStats() ?? (attacker.stats as any);

  // defenderStats will be used when mob needs to detect something on player to decide your action.
  const defenderStats: StatsProps | undefined = defender
    ? defender.combatState?.getEffectiveStats() ?? (defender.stats as any)
    : undefined;
  void defenderStats; // reserved for future AI logic

  // filter out skills on cooldown or blocked by CC
  const availableSkills: Skill[] = attacker.skills.filter((skill: Skill | null) => {
    if (!skill) return false;
    if (attacker.combatState && attacker.combatState.isOnCooldown(skill))
      return false;
    if (attacker.turnSystem && attacker.turnSystem.isCrowdControlled(skill))
      return false;
    return true;
  }) as Skill[];

  // prefer heal if needed and effective
  const maxHp = attacker.combatState
    ? attacker.combatState.getEffectiveStats().maxHp
    : attackerStats.maxHp;
  const currentHp = attacker.combatState
    ? attacker.combatState.currentHp
    : (attacker as any).health?.currentHp ?? maxHp;

  // small helper to predict effect scaling similar to EffectSystem.calculateScaling
  function predictScaling(effect: Partial<Effect> | null, stats: StatsProps) {
    if (!effect || !(effect as any).scaling) return 0;
    let value = 0;
    for (const [key, mod] of Object.entries((effect as any).scaling)) {
      value += ((stats as any)[key] || 0) * (mod as number);
    }
    value = Math.floor(value);
    return value === 0 ? 1 : value;
  }

  // find healing skills (hot or support heal)
  if (currentHp < maxHp) {
    for (const skill of availableSkills) {
      // hot-style effect (effectType === 'hot')
      const effect = skill.effects as any;
      if (effect && effect.effectType === "hot") {
        const predictedHeal = predictScaling(effect, attackerStats);
        if (predictedHeal > 0) return skill.id;
      }

      // support-style skill (typeSkill === 'support' with a `heal` payload)
      if (skill.typeSkill === "support" && skill.heal) {
        const predictedHeal = predictScaling(
          { scaling: skill.heal.scaling } as any,
          attackerStats,
        );
        if (predictedHeal > 0) return skill.id;
      }
    }
  }

  // otherwise pick first damaging/action skill
  for (const skill of availableSkills) {
    if (
      skill.damage &&
      skill.damage.scaling &&
      Object.keys(skill.damage.scaling).length > 0
    ) {
      return skill.id;
    }
  }

  // if nothing found, fallback to first available skill id
  if (availableSkills.length > 0) return availableSkills[0].id;

  return null;
}

