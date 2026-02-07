# Equipment DataLists

Central registry and list files for equipment definitions.

## Structure

```
 equipment/
  early/
    accessories.ts
    armors.ts
    weapons.ts
    register.ts
  register.ts
  README.md
```

## Usage

```typescript
import { equipmentRegistry } from "src/game/dataLists/equipment/register";

const item = equipmentRegistry["starter_sword"];
```
