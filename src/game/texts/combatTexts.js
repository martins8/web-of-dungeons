export default class CombatTexts {
  die(defender) {
    const string = `${defender.name} foi morto em combate ⚰️`;
    return string;
  }
  physical(amount, offender, defender) {
    const string = `${offender.name} efetuou um ataque físico de ${amount}⚔️ em
      ${defender.name} que mitigou ${defender.reducePhysicalAtk()} 🛡️, 
      HP DEFENDER ${defender.health.currentHp}🩸\n`;
    return string;
  }
}
