# TypeScript Guide - Web of Dungeons

Este documento serve como referência rápida para trabalhar com TypeScript neste projeto.

## 📋 Visão Geral

O projeto foi **totalmente migrado para TypeScript** (v5.9.3). Todos os arquivos agora usam:
- `.ts` para lógica/servidor
- `.tsx` para componentes React
- `.test.ts` para testes

---

## 🚀 Início Rápido

### Estrutura de Pastas

```
src/
├── app/                # Next.js App Router (React components)
│   ├── (home)/        # Home page layout
│   ├── combat/        # Combat page layout
│   ├── api/           # API routes
│   └── styles/        # Global styles
├── components/        # Reusable React components
│   ├── charts/        # Chart components (Chart.js)
│   ├── log/           # Combat log component
│   └── panels/        # UI panels (stats, etc)
├── game/              # Game engine logic
│   ├── AI/            # AI logic
│   ├── dataLists/     # Game data (mobs, skills, encounters)
│   ├── entities/      # Core entities (Character, Mob)
│   ├── factories/     # Object factories
│   ├── gcomponents/   # Game state components (health, effects, etc)
│   ├── orchestrators/ # Combat orchestration
│   ├── rng/           # Random number generators
│   ├── services/      # Business logic services
│   ├── systems/       # Game systems (combat, effects, turns)
│   ├── texts/         # Game event text generation
│   ├── utils/         # Utility functions
│   └── value-objects/ # Domain value objects
├── infra/             # Infrastructure (database, migrations)
└── tests/             # Test suite
    ├── game/
    │   ├── integrations/  # Integration tests
    │   └── unit/         # Unit tests
    └── integrations/     # API integration tests
```

---

## 📝 Padrões TypeScript Usados

### 1. **Value Objects** (Tipos imutáveis de domínio)

```typescript
// src/game/value-objects/stats.ts
export interface StatsProps {
  maxHp: number;
  strength: number;
  defense: number;
  magicAttack: number;
  magicDefense: number;
  speed: number;
  luck: number;
}

export default class Stats {
  readonly maxHp: number;
  readonly strength: number;
  // ... outros atributos

  constructor(props: StatsProps) {
    this.maxHp = props.maxHp;
    // ...
  }
}
```

**Bons práticas:**
- Use `readonly` para propriedades imutáveis
- Defina uma interface `Props` para o construtor
- Não mutate estado dentro dos value objects

### 2. **Entidades** (Objetos com identidade)

```typescript
// src/game/entities/character.ts
export default class Character {
  id: string;
  name: string;
  private health: Health;
  private combatState: CombatState;

  constructor(id: string, name: string, stats: StatsProps) {
    this.id = id;
    this.name = name;
    this.health = new Health(stats.maxHp);
    this.combatState = new CombatState(stats, attributes);
  }

  takeDamage(amount: number): void {
    this.health.takeDamage(amount);
  }
}
```

**Boas práticas:**
- Estruture métodos por responsabilidade
- Use private/public corretamente
- Componha objetos ao invés de herança

### 3. **Services** (Lógica de negócio)

```typescript
// src/game/services/statsCalculator.ts
export default class StatsCalculator {
  static calculate(attributes: Attributes): StatsProps {
    return {
      maxHp: 100 + attributes.constitution * 5,
      strength: attributes.strength + 10,
      // ...
    };
  }
}
```

**Boas práticas:**
- Use métodos estáticos para operações puras
- Não mantenha estado
- Retorne novos objetos ao invés de mutar

### 4. **Tipos Genéricos**

```typescript
// Filtrar um array com type safety
function filterByProperty<T>(arr: T[], key: keyof T, value: unknown): T[] {
  return arr.filter(item => item[key] === value);
}

// Uso
const buffs = getAllEffects().filter(e => e.duration > 0);
```

### 5. **Union Types & Type Guards**

```typescript
type EffectDuration = number | null;

function processDuration(duration: EffectDuration): void {
  if (typeof duration === "number") {
    // duration é number aqui
    duration -= 1;
  } else if (duration === null) {
    // duration é null aqui
    // Effects com null duration têm significado especial
  }
}
```

### 6. **Interfaces para Props de Componentes**

```typescript
// src/components/panels/stats/StatsPanel.tsx
interface StatsPanelProps {
  character: Character;
  onStatChange?: (stat: string, value: number) => void;
}

export default function StatsPanel({ character, onStatChange }: StatsPanelProps) {
  return <div>{/* ... */}</div>;
}
```

---

## 🧪 Testes em TypeScript

Todos os testes agora são `.test.ts` e funcionam naturalmente com Jest + TypeScript.

### Exemplo de Teste Unitário

```typescript
// src/tests/game/unit/entities/character.test.ts
describe("Character TESTS", () => {
  test("should create character with initial stats", () => {
    const char = new Character("test_1", "Hero", {
      maxHp: 100,
      strength: 10,
      // ... outros stats
    });

    expect(char.name).toBe("Hero");
    expect(char.currentHp).toBe(100);
  });

  test("should take damage", () => {
    const char = new Character("test_1", "Hero", defaultStats);
    char.takeDamage(25);
    expect(char.currentHp).toBe(75);
  });
});
```

### Rodando Testes

```bash
# Rodar todos os testes
npm test

# Rodar testes em modo watch
npm run test:watch

# Rodar um arquivo específico
npm test -- src/tests/game/unit/entities/character.test.ts
```

---

## 🎯 Guia de Tipos Essenciais

### Tipos Primitivos

```typescript
let nome: string = "Herói";
let nivel: number = 5;
let ativo: boolean = true;
let desconhecido: unknown; // Seguro, requer type guard
let qualquer: any; // Evite! Desativa type checking
```

### Arrays

```typescript
let numbers: number[] = [1, 2, 3];
let array: Array<string> = ["a", "b"];

// Array de union types
let valores: (string | number)[] = [1, "dois", 3];

// Array readonly
let readonly: readonly string[] = ["a", "b"];
```

### Objetos

```typescript
// Type annotation
const jogador: { nome: string; nivel: number } = {
  nome: "Hero",
  nivel: 1,
};

// Interface (melhor para objetos)
interface Jogador {
  nome: string;
  nivel: number;
  ativo?: boolean; // propriedade opcional
}

// Usar interface
const player: Jogador = { nome: "Hero", nivel: 1 };
```

### Função com Tipos

```typescript
// Parâmetros e retorno tipados
function calcularDano(
  strength: number,
  target: Entity
): number {
  return strength * 2;
}

// Arrow function
const heal = (amount: number): number => amount;

// Função que retorna void
function logEvento(msg: string): void {
  console.log(msg);
}
```

### Generics

```typescript
// Classe genérica
class Repository<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  getAll(): T[] {
    return [...this.items];
  }
}

// Uso
const characterRepo = new Repository<Character>();
```

---

## 🔄 Type Narrowing (Refinar Tipos)

### typeof Guard

```typescript
function processar(valor: string | number) {
  if (typeof valor === "string") {
    // valor é string aqui
    return valor.toUpperCase();
  } else {
    // valor é number aqui
    return valor * 2;
  }
}
```

### instanceof Guard

```typescript
function aplicarEfeito(entidade: Character | Mob) {
  if (entidade instanceof Character) {
    // Acesse propriedades específicas de Character
    entidade.gainExperience(100);
  }
}
```

### Type Predicate

```typescript
const isCharacter = (obj: unknown): obj is Character => {
  return obj instanceof Character;
};

function processar(obj: unknown) {
  if (isCharacter(obj)) {
    // obj é Character aqui
  }
}
```

---

## 🛠️ Componentes React em TypeScript

### Componentes Funcionais

```typescript
// src/components/panels/stats/StatsPanel.tsx
import React from "react";
import type { Character } from "src/game/entities/character";

interface StatsPanelProps {
  character: Character;
  title?: string;
}

export default function StatsPanel({
  character,
  title = "Stats",
}: StatsPanelProps): React.ReactNode {
  return (
    <div>
      <h2>{title}</h2>
      <p>HP: {character.currentHp}</p>
    </div>
  );
}
```

### Props com Children

```typescript
interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export default function Container({ children, className }: ContainerProps) {
  return <div className={className}>{children}</div>;
}
```

### Event Handlers

```typescript
import { MouseEvent, ChangeEvent } from "react";

function MyComponent() {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget.innerText);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };

  return (
    <>
      <button onClick={handleClick}>Click me</button>
      <input onChange={handleChange} />
    </>
  );
}
```

---

## 💡 Boas Práticas

### ✅ Faça

```typescript
// Use interfaces para contracts públicos
interface Effect {
  id: string;
  duration: number | null;
  apply(target: Entity): void;
}

// Use type narrowing
function processar(effect: Effect | null) {
  if (effect) {
    effect.apply(entity);
  }
}

// Retorne tipos explícitos
function getCharacter(id: string): Character | null {
  return characters.find(c => c.id === id) ?? null;
}

// Type object ao invés de any
const effect: Record<string, unknown> = JSON.parse(json);
```

### ❌ Evite

```typescript
// Não use any
const data: any = api.getData(); // ❌

// Não use force casting sem motivo
const num = str as number; // ❌

// Não ignore type errors com @ts-ignore
// @ts-ignore
problematicLine();

// Não use tipos muito complexos sem documentação
type Complexo = ((x: T) => (y: U) => V) | ((a: A) => B); // ❌
```

---

## 📚 Recursos Úteis

### Documentação
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [TypeScript Playground](https://www.typescriptlang.org/play)

### Ferramentas
- **tsconfig.json** - Configuração TypeScript (verificar raiz do projeto)
- **jest.config.js** - Configuração Jest (suporta TypeScript nativamente)

### Verificar Tipos

```bash
# Compilar TypeScript sem gerar arquivos
npx tsc --noEmit

# Verificar tipos em arquivo específico
npx tsc --noEmit src/game/entities/character.ts
```

---

## 🔍 Debugging

### Adicionar Tipos Implícitos

```typescript
// Ao invés de permitir inferência sem verificação
const effect = json.effect; // ❌ type: any

// Declare explicitamente
const effect: Effect = JSON.parse(json) as Effect;

// Melhor: use validação
function validateEffect(data: unknown): Effect {
  if (!isEffect(data)) throw new Error("Invalid effect");
  return data;
}
```

### Type Checking em Dev

```bash
# Watch mode para erros de tipo durante desenvolvimento
npx tsc --watch --noEmit
```

---

## 📦 Configuração do Projeto

### Versões

- **TypeScript**: 5.9.3
- **Jest**: 30.2.0
- **Node**: 18+

### Scripts

```json
{
  "dev": "next dev",              // Rodar em modo desenvolvimento
  "test": "jest --verbose",        // Rodar testes
  "test:watch": "jest --watch"    // Rodar testes em watch mode
}
```

---

## 🎓 Próximos Passos

1. **Explore o código existente** - Veja exemplos reais em:
   - `src/game/entities/` - Padrão de entidades
   - `src/game/value-objects/` - Value objects
   - `src/game/services/` - Services tipados

2. **Ao adicionar novo código:**
   - Sempre declare tipos de parâmetros e retorno
   - Use interfaces para contracts públicos
   - Crie value objects para dados imutáveis

3. **Ao modificar código existente:**
   - Respeite tipos existentes
   - Não remova `readonly` sem motivo
   - Atualize tipos quando mudar comportamento

---

**Última atualização**: 2026-02-05 | **Status**: Totalmente em TypeScript ✅
