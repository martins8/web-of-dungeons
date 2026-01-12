import actionSkillsList, { Character, Combat } from "src/game/server";
const skills = actionSkillsList;
function CombatLog() {
  const player = new Character(
    "Hero",
    {
      sta: 150,
      str: 5,
      con: 10,
      dex: 5,
      int: 5,
      wis: 5,
      agi: 10,
      cha: 5,
    },
    skills,
  );
  const enemy = new Character(
    "Goblin",
    {
      sta: 150,
      str: 10,
      con: 5,
      dex: 10,
      int: 5,
      wis: 5,
      agi: 10,
      cha: 5,
    },
    skills,
  );
  const combat = new Combat(player, enemy);
  const result = combat.start();
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
