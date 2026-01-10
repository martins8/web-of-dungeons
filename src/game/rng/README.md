📁 RNG System – Combat Probability Architecture

Este diretório contém o sistema determinístico de RNG e os systems probabilísticos de combate (Crit e Evade) usados no core do jogo.

O objetivo deste design é garantir:

🎲 RNG determinístico e reproduzível

⚖️ Probabilidades justas, sem streaks extremos

🧪 Combates testáveis

🌐 Compatibilidade futura com PvP / replay

🧠 Separação clara entre infraestrutura e regras de jogo

Combat
 ├─ SeedRNG (1 por combate)
 ├─ Attacker.CritSystem
 ├─ Defender.EvadeSystem
 └─ CombatResolve
        └─ executa regras usando RNG + systems

O RNG pertence ao combate

O estado probabilístico pertence ao personagem

O CombatResolve não mantém estado

estado

## 🎲 SeedRNG (Infraestrutura)
### Responsabilidade

Gerar números pseudoaleatórios determinísticos, a partir de um seed explícito.

```js
  export default class SeedRNG {
  constructor(seed) {
    if (seed === undefined) {
      throw new Error("RNG requires an explicit seed");
    }
    this.seed = seed;
  }

  next() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }

  rollPercent() {
    return this.next() * 100;
  }
}

```
Características

❌ Não usa Math.random()

✅ Determinístico (mesmo seed → mesmos resultados)

✅ Ideal para testes, replay e multiplayer

❌ Não contém regras de jogo

Uso

Criado uma vez por combate

Injetado nos systems de crit/evade via CombatResolve

## 🎯 CritSystem (Estado do atacante)
### Responsabilidade

Determinar se um ataque físico ou mágico é crítico, usando:

Chance base (derivada de stats)

Acúmulo progressivo em caso de falha (anti-frustração)

```js
export default class CritSystem {
  constructor({ baseChance, bonusPerFail, maxChance }) {
    this.baseChance = baseChance;
    this.bonusPerFail = bonusPerFail;
    this.maxChance = maxChance;
    this.currentBonus = 0;
  }

  tryCrit(rng) {
    const finalChance = Math.min(
      this.baseChance + this.currentBonus,
      this.maxChance
    );

    const roll = rng.rollPercent();

    if (roll < finalChance) {
      this.currentBonus = 0;
      return true;
    }

    this.currentBonus += this.bonusPerFail;
    return false;
  }
}
```
Funcionamento

baseChance → chance inicial (%)

currentBonus → cresce a cada falha

maxChance → limite de segurança

Ao critar → bônus é resetado

📌 O CritSystem pertence ao atacante, não ao combate global.

## 🏃 EvadeSystem (Estado do defensor)
### Responsabilidade

Determinar se um ataque recebido é evadido, usando lógica idêntica ao crit.

```js
export default class EvadeSystem {
  constructor({ baseChance, bonusPerFail, maxChance }) {
    this.baseChance = baseChance;
    this.bonusPerFail = bonusPerFail;
    this.maxChance = maxChance;
    this.currentBonus = 0;
  }

  tryEvade(rng) {
    const chance = Math.min(
      this.baseChance + this.currentBonus,
      this.maxChance
    );

    const roll = rng.rollPercent();

    if (roll < chance) {
      this.currentBonus = 0;
      return true;
    }

    this.currentBonus += this.bonusPerFail;
    return false;
  }
}
```
📌 O EvadeSystem pertence ao defensor.

## 📊 Integração com Stats (modelo atual)
O sistema foi projetado para funcionar diretamente com stats percentuais, sem necessidade de mudança no modelo atual.

StatsCalculator (resumo relevante)

```js
critC: 10 + attributes.dex * 0.5,
critD: 50 + attributes.dex * 0.5,
eva:   10 + attributes.agi * 1.5,
luck:  attributes.cha * 4,
```
Como os stats são usados

critC (%):

Usado como chance base do CritSystem

eva (%):

Usado como chance base do EvadeSystem

critD (%):

Aplicado como multiplicador de dano

luck:

Reservado para futuras extensões do RNG

(ex: reduzir bônus por falha, alterar caps, influenciar seed)

📌 Nenhum stat precisa mudar de formato.
Tudo continua sendo porcentagem direta.

1. Combat possui um SeedRNG
2. Attacker possui CritSystem
3. Defender possui EvadeSystem

4. CombatResolve.physical():
   ├─ EvadeSystem.tryEvade(rng)
   │    └─ se true → ataque falha
   ├─ CritSystem.tryCrit(rng)
   │    └─ se true → dano crítico
   ├─ Aplica defesa
   └─ Retorna CombatActionResult

🧪 Determinismo e testes

Com o mesmo seed:

Seed = 12345
→ Mesma ordem de rolls
→ Mesmo número de críticos
→ Mesmo número de evasões
→ Mesmo resultado de combate

Isso permite:

Testes unitários confiáveis

Replays

Simulações de balanceamento

PvP sincronizado

🔄 Reset de estado

Os systems (CritSystem, EvadeSystem) mantêm estado acumulado.

Decisão de design:

Resetar no início do combate → padrão

Manter entre combates → roguelike / luck builds

✅ Conclusão

Este sistema de RNG:

Resolve definitivamente o problema de aleatoriedade

Evita streaks extremos

Mantém o jogo justo e previsível

É extensível sem refatorações grandes

Está pronto para multiplayer e replay

📌 A partir deste ponto, RNG é considerado um sistema fechado e estável.