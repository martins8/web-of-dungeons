import Stats from "src/game/value-objects/stats";

/*futuramente essa classe será responsável por calcular a depender dos equipamentos, buffs e 
classe(warrior, mage, rogue etc.), tendo em vista que cada classe terá modificadores diferentes para ampliar os stats

será necessário definir soft cap critC & critD

// STR: força e impacto
// DEX: precisão e técnica
// AGI: tempo e mobilidade
// CON: resiliência
// STA: resistência e vida
// INT: poder mágicoe leve cura
// WIS: defesa mágica, cura
// CHA: sorte, eventos, social, pet
*/

export default class StatsCalculator {
  static calculate(attributes) {
    return new Stats({
      pDmg: attributes.str * 2 + attributes.dex,
      mDmg: attributes.int * 2 + attributes.wis,
      pDef: attributes.con * 2 + attributes.str,
      mDef: attributes.wis * 2 + attributes.int + attributes.con * 0.5,
      maxHp: 20 + attributes.sta * 2 + attributes.con * 0.5,
      critC: 10 + attributes.dex * 0.5,
      critD: 50 + attributes.dex * 0.5,
      eva: 10 + attributes.agi * 1.5,
      init: attributes.agi,
      speed: attributes.agi,
      luck: attributes.cha * 4,
      hPower: attributes.wis * 2 + attributes.int,
    });
  }
}
