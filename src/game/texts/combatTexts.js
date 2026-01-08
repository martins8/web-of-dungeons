export default class CombatTexts {
  //physical damage
  physical(amount, offender, defender) {
    const string = `${offender.getName()} efetuou um ataque físico em
      ${defender.getName()} e infligiu ${amount} de dano\n`;
    return string;
  }
}
