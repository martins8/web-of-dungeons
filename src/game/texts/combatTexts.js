/*classe that will be return the object which front gonna use to show combat data
need to implement a return object with more informative data, not just a simple string. 
*/

export default class CombatTexts {
  fromResult(result) {
    if (result.typeDamage === "physical") {
      return this.physical(result);
    }
  }

  physical(result) {
    if (result.isEvaded) {
      return `${result.defender.name} esquivou do ataque de ${result.attacker.name} 🏃‍♂️\n`;
    }

    let text = `${result.attacker.name} atacou fisicamente ${result.defender.name} causando ${result.damage}⚔️`;

    if (result.isCritical) {
      text += "💥";
    }

    text += ` — HP restante: ${result.defender.health.currentHp}🩸\n`;

    if (result.isDead) {
      text += `${result.defender.name} foi morto em combate ⚰️\n`;
    }

    return text;
  }
}
