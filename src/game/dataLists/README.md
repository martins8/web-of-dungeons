# Game DataLists

Central location for all game configuration and data definitions used by the combat engine, factories, and systems.

## Structure

```
dataLists/
├── encounters/        # Encounter pool definitions
│   └── world.js      # World encounter templates
├── mob/              # Mob definitions
│   └── normal.js     # Normal mob templates
├── skills/           # Skill definitions
│   ├── register.js   # Central skill registry (lookup by id)
│   ├── buffList.js   # Buff skills
│   ├── physical/
│   │   └── actionSkillsList.js  # Physical/melee skills
│   └── magic/
│       └── list.js   # Magical skills (placeholder)
└── README.md         # This file
```

## File Descriptions

### `mob/normal.js`
Defines mob templates with base attributes, skills, type, archetype, and flavor text.

**Entry shape:**
```javascript
{
  name: "Mob Name",
  attributes: { sta, str, con, dex, int, wis, agi, cha },
  skills: ["skill_id", ...],
  type: "normal|rare|elite|boss",
  archetype: "humanoid|beast|demon|undead|dragon|fairy",
  description: "Flavor text"
}
```

**Usage:** `MobFactory.fromMobId(id)` looks up mob definitions here.

---

### `skills/register.js`
**Central registry** that aggregates all skill lists and exports a lookup object.

**Export:** `skillRegistry` — a map of `skillId -> Skill`

```javascript
import { skillRegistry } from "src/game/dataLists/skills/register";
const skill = skillRegistry["skill_001"]; // O(1) lookup
```

---

### `skills/buffList.js`
Array of `Skill` instances representing simple attribute buffs.

**Entry shape:**
```javascript
new Skill({
  id: "buff_001",
  rank: 1,
  typeSkill: "buff",
  reach: "global",
  cooldown: 0,
  effects: new Effect({
    id: "effect_xxx",
    target: "self",
    effectType: "buff",
    mechanic: "refresh",
    subtype: "attribute",
    scaling: { str: 1 },
    duration: 5
  }),
  metadata: { name, text, rarity }
})
```

---

### `skills/physical/actionSkillsList.js`
Array of `Skill` instances representing physical/melee attacks.

**Features:**
- Base damage scaling from stats
- Optional DoT/debuff effects
- Variable cooldowns and skill ranks

**Example:**
```javascript
new Skill({
  id: "skill_001",
  rank: 1,
  typeSkill: "action",
  reach: "melee",
  cooldown: 0,
  damage: { typeDamage: "physical", scaling: { pDmg: 1 } },
  effects: null,  // or Effect instance for DoT/debuff
  metadata: { name, text, rarity }
})
```

---

### `skills/magic/list.js`
Array of `Skill` instances for magical skills (currently placeholder).

Expected to grow with magical damage types and special effects (heals, control, etc).

---

### `encounters/world.js`
Defines encounter pools for the world encounter system.

**Entry shape:**
```javascript
{
  type: "world",  // or "dungeon", "event"
  rounds: 10,     // number of rounds/encounters
  pool: [
    {
      id: "wolf_01",      // mob id
      weight: 1,          // spawn weight (weighted RNG)
      maxAppear?: 3,      // optional: max times this mob appears
      fixedRound?: null   // optional: force appearance at specific round
    },
    // ...
  ]
}
```

**Usage:** `EncounterSystem` consumes these definitions and generates weighted random encounters.

---

## Design Patterns

### Skill Registry Pattern
All skills are registered in a central lookup for O(1) resolution:
```javascript
// Bad: searching arrays repeatedly
const skill = physicalSkillsList.find(s => s.id === "skill_001");

// Good: O(1) lookup
const skill = skillRegistry["skill_001"];
```

### Effect Composition
Skills use embedded `Effect` objects rather than external links. This keeps skill data self-contained.

### Attribute Validation
- All attributes are **integers** (can be negative for debuffs)
- Mob definitions must use 8 base attributes + 10 points to distribute
- All skills must exist in the registry before use

---

## Optional Improvements

### 1. **Schema Validation** (High Priority)
Add runtime schema validators to catch data entry errors early:
```javascript
// utils/validators/skillValidator.js
class SkillValidator {
  static validate(skill) {
    if (!skill.id) throw new Error("Skill missing id");
    if (!skillRegistry[skill.id]) throw new Error("Skill not in registry");
    // ... more checks
  }
}
```

### 2. **Data Normalization** (Medium Priority)
Extract shared patterns into factories or builders:
```javascript
// factories/skillBuilder.js
class SkillBuilder {
  static physical(id, name, pDmgScaling) { /* ... */ }
  static buff(id, attribute, amount) { /* ... */ }
}
```

### 3. **Configuration Constants** (Medium Priority)
Move hardcoded numbers into a constants file:
```javascript
// constants.js
export const MOB_CONFIG = {
  BASE_ATTRIBUTES: 8,
  DISTRIBUTE_POINTS: 10,
  VALID_TYPES: ["normal", "rare", "elite", "boss"],
  VALID_ARCHETYPES: ["humanoid", "beast", "demon", "undead", "dragon", "fairy"]
};
```

### 4. **Dungeon & Event Encounters** (Low Priority)
Currently only `world` encounters are defined. Add:
```javascript
// encounters/dungeon.js
export const dungeonEncounters = { /* ... */ };

// encounters/events.js
export const eventEncounters = { /* ... */ };
```

### 5. **Localization Support** (Low Priority)
Move human-readable strings into a separate localization file:
```javascript
// i18n/en.json
{
  "skills": {
    "skill_001": { "name": "Basic Attack", "description": "..." }
  }
}
```

### 6. **Auto-Generate Skill Registry** (Low Priority)
If the project grows, consider auto-discovery instead of manual imports:
```javascript
// register.js (auto-discovery)
const skillModules = import.meta.glob("./*/list.js", { eager: true });
const allSkills = Object.values(skillModules).flatMap(m => m.default);
```

### 7. **Import Type Safety** (Low Priority)
Add TypeScript or JSDoc type hints:
```javascript
/**
 * @typedef {Object} MobDefinition
 * @property {string} name
 * @property {Attributes} attributes
 * @property {string[]} skills
 * @property {string} type
 * @property {string} archetype
 * @property {string} description
 */
```

---

## Best Practices

✅ **Do:**
- Keep data files focused (one concept per file)
- Use `skillRegistry` for skill lookups
- Document new encounter types
- Validate data at load time if possible

❌ **Don't:**
- Add game logic to data files (logic belongs in systems/services)
- Hardcode ids in multiple places (use constants)
- Create circular dependencies between data files
- Manually search arrays when registry exists

---

## Quick Start

**Adding a new skill:**
```javascript
// 1. Create in appropriate list file
const newSkill = new Skill({
  id: "skill_099",
  rank: 1,
  typeSkill: "action",
  // ... other props
});

// 2. Ensure it's in the exported array
export default [existingSkill, newSkill]; // <-- add to array

// 3. Auto-registered in skillRegistry (no manual step needed)
```

**Adding a new mob:**
```javascript
// 1. Add to mobDefinitions in mob/normal.js
export const mobDefinitions = {
  new_mob_01: {
    name: "New Mob",
    attributes: { /* ... */ },
    skills: ["skill_001"],
    type: "normal",
    archetype: "beast",
    description: "New mob"
  }
};

// 2. Use with MobFactory
const mob = MobFactory.fromMobId("new_mob_01");
```

**Adding a new encounter:**
```javascript
// 1. Add to worldEncounters in encounters/world.js
export const worldEncounters = {
  encounter_99: {
    type: "world",
    rounds: 5,
    pool: [
      { id: "wolf_01", weight: 1, maxAppear: 2 }
    ]
  }
};

// 2. Use with EncounterSystem
const encounter = new EncounterSystem(worldEncounters.encounter_99);
```

---

## Related Files
- `src/game/factories/mobFactory.js` — Creates mobs from definitions
- `src/game/factories/eventFactory.js` — Creates events from results
- `src/game/systems/encounterSystem.js` — Generates encounters from pools
- `src/game/systems/combat.js` — Resolves combat with skills
