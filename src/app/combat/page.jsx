import { Character, Combat } from "src/game/api";

function CombatLog() {
  const player = new Character("Hero", {
    sta: 10,
    str: 5,
    con: 10,
    dex: 5,
    int: 5,
    wis: 5,
    agi: 5,
    cha: 5,
  });
  const enemy = new Character("Goblin", {
    sta: 5,
    str: 10,
    con: 5,
    dex: 5,
    int: 5,
    wis: 5,
    agi: 10,
    cha: 5,
  });
  const combat = new Combat(player, enemy);
  const result = combat.startCombat();
  const lines = result.split("\n").filter(Boolean);

  return (
    <div>
      {lines.map((line, index) => (
        <p key={index}>{line}</p>
      ))}
    </div>
  );
}

export default function CombatPage() {
  return (
    <div style={{ textAlign: "center" }}>
      <CombatLog />
    </div>
  );
}
