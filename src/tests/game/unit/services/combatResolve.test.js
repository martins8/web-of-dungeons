import CombatResolve from "src/game/services/combatResolve";

describe("CombatResolve TEST", () => {
  test("should apply physical damage and return damage value", () => {
    const offender = {
      doPhysicalAtk: jest.fn().mockReturnValue(20),
    };

    const defender = {
      takePhysicalAtk: jest.fn(),
    };

    const combatResolve = new CombatResolve();

    const damage = combatResolve.physical(offender, defender);

    expect(offender.doPhysicalAtk).toHaveBeenCalled();
    expect(defender.takePhysicalAtk).toHaveBeenCalledWith(20);
    expect(damage).toBe(20);
  });
});
