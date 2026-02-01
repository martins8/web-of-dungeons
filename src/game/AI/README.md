AI folder - MVP normal mob AI

This folder contains simple AI helpers for mobs. The goal is to provide
minimal decision logic for a turn-based text RPG to drive enemy behavior
without coupling it to UI or complex strategy systems.

Files
- normal.js: MVP AI that selects a skill to use for a "normal" mob.

What `normal.js` does (MVP)
- Scans the mob's `skills` array and filters out skills that are on cooldown
  or that the `turnSystem` marks as blocked by crowd control.
- If the mob is wounded (current HP < max HP) it searches for a healing
  skill (`effectType === 'hot'`) and uses it only if the predicted heal
  amount is > 0 (basic effectiveness check).
- Otherwise it selects the first available damaging/action skill.
- If nothing is available, it returns `null` (caller should handle fallback).

Why this shape?
- Keeps AI simple and deterministic for an MVP.
- Avoids adding randomness, pathfinding or state machines until core
  mechanics are stable.

How to use
- Import and call from your combat orchestrator or UI when deciding which
  skill the mob will use in its turn:

```javascript
import decideSkill from 'src/game/AI/normal';

const skillId = decideSkill(mob, player);
if (skillId) combat.performAction(skillId);
```

Notes & assumptions
- The function expects `attacker` and `defender` to be `Character` objects
  used across the engine (`.skills`, `.combatState`, `.turnSystem`, `.stats`).
- Healing prediction is a simple linear estimation based on effect.scaling
  and the mob's effective stats. It mirrors the calculation used in
  `EffectSystem.calculateScaling` but intentionally kept local to avoid
  heavy coupling.

Next steps / How to scale this AI (suggestions)
1. Priority system / weights
   - Give each skill a weight and compute a score per-turn (damage, heal
     need, crowd control utility). Pick highest-scoring skill.
2. State machine
   - Implement states like `AGGRESSIVE`, `DEFENSIVE`, `FLEE` and switch
     behavior based on HP, encounter progress or player state.
3. Randomness & unpredictability
   - Add randomness to choice to avoid deterministic patterns. Use RNG
     with seeded behavior for reproducible tests.
4. Targeting & group tactics
   - For encounters with multiple allies/enemies, add target selection
     logic (heal lowest HP ally, focus fire, interrupt casters).
5. Skill combos & cooldown planning
   - Plan multi-turn combos and avoid wasting cooldowns (look ahead).
6. Separate AI module and registry
   - Allow different archetypes ("normal", "smart", "boss") and a small
     registry to pick AI by mob archetype.
7. Logging & telemetry
   - Emit debug logs for AI decisions to help balancing and debugging.

Example expansion: finite-state AI
- At its simplest, add `mob.aiState` and update on damage or kills.
- When `aiState === 'DEFENSIVE'` prioritize heals and CC; when `AGGRESSIVE`
  prioritize highest damage.

This README documents the minimal approach implemented and provides
practical steps to improve AI complexity later. If you want, I can
implement the next step (priority weights or a simple state machine).