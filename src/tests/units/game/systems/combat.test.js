import Combat from "src/game/systems/combat";
import Character from "src/game/entities/character";

const validAttrs = {
  sta: 10,
  str: 10,
  con: 10,
  dex: 10,
  int: 10,
  wis: 10,
  agi: 10,
  cha: 10,
};
describe("COMBAT TEST", () => {
  test("combat instance initialized", () => {
    const player = new Character("rogue", validAttrs);
    const enemy = new Character("ghost", validAttrs);
    const combat = new Combat(player, enemy);
    expect(combat).toBeDefined();
    expect(combat.player).toBeDefined();
    expect(combat.enemy).toBeDefined();
  });
});
