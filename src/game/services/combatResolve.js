export default class CombatResolve {
  physical(offender, defender) {
    const damage = offender.doPhysicalAtk();
    defender.takePhysicalAtk(damage);
    return damage;
  }
}
