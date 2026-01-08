export default class CombatTexts {
  die(defender) {
    const string = `${defender.getName()} foi morto em combate ⚰️`;
    return string;
  }
  //physical damage
  physical(amount, offender, defender) {
    const string = `${offender.getName()} efetuou um ataque físico de ${amount}⚔️ em
      ${defender.getName()} que mitigou ${defender.reducePhysicalAtk()} 🛡️, 
      HP DEFENDER ${defender.getCurrentHp()}🩸\n`;
    return string;
  }
}
