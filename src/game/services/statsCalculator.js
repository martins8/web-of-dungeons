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
      maxHp: Math.floor(20 + attributes.sta * 2 + attributes.con * 0.5),
      pDmg: Math.floor(attributes.str * 2 + attributes.dex),
      mDmg: Math.floor(attributes.int * 2 + attributes.wis),
      pDef: Math.floor(attributes.con * 2 + attributes.str),
      mDef: Math.floor(
        attributes.wis * 2 + attributes.int + attributes.con * 0.5,
      ),
      critC: Math.floor(10 + attributes.dex * 0.5),
      critD: Math.floor(50 + attributes.dex * 0.5),
      eva: Math.floor(10 + attributes.agi * 1.5),
      init: Math.floor(attributes.agi),
      speed: Math.floor(attributes.agi),
      luck: Math.floor(attributes.cha * 4),
      hPower: Math.floor(attributes.wis * 2 + attributes.int),
      maestry: Math.floor(attributes.dex),
    });
  }
}
