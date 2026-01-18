/* ESSA PÁGINA É PROVISÓRIA ENQUANTO A ENGINE ESTÁ NA SUA FASE INICIAL
POSTERIORMENTE, SERÁ UTILIZADO API PARA INTEGRAR COM O FRONT-END */

import { Combat, Character } from "src/game/server";
import skills from "src/game/archetypes/skillsList/physical/actionSkillsList";
import AttributesRadar from "src/components/charts/AttributesRadar";
import StatsBar from "src/components/charts/StatsBar";
import StatsPanel from "src/components/panels/stats/StatsPanel";
import CombatLog from "src/components/log/CombatLog";
function attributesToPlain(attrs) {
  return {
    sta: attrs.sta,
    str: attrs.str,
    con: attrs.con,
    dex: attrs.dex,
    int: attrs.int,
    wis: attrs.wis,
    agi: attrs.agi,
    cha: attrs.cha,
  };
}

function statsToPlain(stats) {
  return {
    pDmg: stats.pDmg,
    mDmg: stats.mDmg,
    pDef: stats.pDef,
    mDef: stats.mDef,
    critC: stats.critC,
    critD: stats.critD,
    eva: stats.eva,
    luck: stats.luck,
    init: stats.init,
    speed: stats.speed,
    maxHp: stats.maxHp,
    hPower: stats.hPower,
    maestry: stats.maestry,
  };
}
function characterToView(character) {
  const state = character.combatState;

  const effectiveAttributes = state.getEffectiveAttributes();
  const effectiveStats = state.getEffectiveStats();

  return {
    name: character.name,
    hp: state.currentHp,
    maxHp: effectiveStats.maxHp,

    attributes: attributesToPlain(effectiveAttributes),
    stats: statsToPlain(effectiveStats),

    effects: {
      buffs: state.buffs.map((e) => ({
        type: e.effectType,
        subtype: e.subtype,
        duration: e.duration,
      })),
      debuffs: state.debuffs.map((e) => ({
        type: e.effectType,
        subtype: e.subtype,
        duration: e.duration,
      })),
      cc: { ...state.cc },
    },

    cooldowns: Object.fromEntries(state.cooldowns),

    skills: character.skills.map((s) => ({
      id: s.id,
      name: s.metadata.name,
      text: s.metadata.text,
      cooldown: state.cooldowns.get(s.id) ?? 0,
    })),
  };
}

export default function CombatPage() {
  // cria personagens
  const player = new Character(
    "Rogue",
    { sta: 100, str: 8, dex: 14, con: 10, int: 6, wis: 6, agi: 10, cha: 6 },
    skills,
  );

  const enemy = new Character(
    "Goblin",
    { sta: 100, str: 6, dex: 8, con: 8, int: 4, wis: 4, agi: 6, cha: 4 },
    skills,
  );

  // cria combate
  const combat = new Combat(player, enemy);

  combat.start();

  // simulação simples só para visualização
  combat.performAction("skill_001");
  combat.performAction("skill_003");
  combat.performAction("skill_002");
  combat.performAction("skill_003");
  while (!combat.finished) {
    combat.performAction("skill_001");
  }

  const playerView = characterToView(player);
  const enemyView = characterToView(enemy);

  return (
    <div
      style={{
        display: "flex",
        gap: 24,
        padding: 24,
        alignItems: "flex-start",
        justifyContent: "center",
      }}
    >
      {/* PLAYER */}
      <section
        style={{
          border: "1px solid #333",
          padding: 16,
          borderRadius: 8,
          background: "#111",
          width: 600,
          display: "grid",
          gridTemplateRows: "auto auto auto 1fr",
          gap: 20,
        }}
      >
        {/* Nome */}
        <div style={{ textAlign: "center" }}>
          <h2>{playerView.name}</h2>
          <p>
            HP: {playerView.hp} / {playerView.maxHp}
          </p>
        </div>

        {/* Atributos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 180px",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 180 }}>
            <AttributesRadar
              attributes={playerView.attributes}
              label="Attributes"
            />
          </div>
          <StatsPanel
            title="Atributos"
            data={playerView.attributes}
            maxMap={{
              str: 50,
              dex: 50,
              con: 50,
              int: 50,
              wis: 50,
              agi: 50,
              sta: 50,
              cha: 50,
            }}
            color="#22d3ee"
          />
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ width: 200 }}>
            <StatsBar stats={playerView.stats} />
          </div>
          <StatsPanel
            title="Stats"
            data={playerView.stats}
            maxMap={{
              pDmg: 200,
              mDmg: 200,
              pDef: 150,
              mDef: 150,
              critC: 100,
              critD: 200,
              eva: 100,
              luck: 100,
              init: 100,
              speed: 100,
              maxHp: 300,
              hPower: 150,
              maestry: 100,
            }}
            color="#facc15"
          />
        </div>

        {/* Skills */}
        <div>
          <h3>Skills</h3>
          <ul>
            {playerView.skills.map((s) => (
              <li key={s.id}>
                {s.name} {s.cooldown > 0 && `(CD ${s.cooldown})`}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* COMBAT LOG */}
      <section
        style={{
          border: "1px solid #555",
          padding: 16,
          borderRadius: 8,
          background: "#0b0b0b",
          width: 520,
          maxHeight: "75vh",
          overflowY: "auto",
          textAlign: "center",
        }}
      >
        <CombatLog log={combat.combatLog} />
      </section>

      {/* ENEMY */}
      <section
        style={{
          border: "1px solid #333",
          padding: 16,
          borderRadius: 8,
          background: "#111",
          width: 600,
          display: "grid",
          gridTemplateRows: "auto auto auto 1fr",
          gap: 20,
        }}
      >
        {/* Nome */}
        <div style={{ textAlign: "center" }}>
          <h2>{enemyView.name}</h2>
          <p>
            HP: {enemyView.hp} / {enemyView.maxHp}
          </p>
        </div>

        {/* Atributos */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 180px",
            alignItems: "center",
            gap: 12,
          }}
        >
          <StatsPanel
            title="Atributos"
            data={enemyView.attributes}
            maxMap={{
              str: 50,
              dex: 50,
              con: 50,
              int: 50,
              wis: 50,
              agi: 50,
              sta: 50,
              cha: 50,
            }}
            color="#22d3ee"
          />

          <div style={{ width: 180 }}>
            <AttributesRadar
              attributes={enemyView.attributes}
              label="Enemy Attributes"
            />
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 200px",
            alignItems: "center",
            gap: 12,
          }}
        >
          <StatsPanel
            title="Stats"
            data={enemyView.stats}
            maxMap={{
              pDmg: 200,
              mDmg: 200,
              pDef: 150,
              mDef: 150,
              critC: 100,
              critD: 200,
              eva: 100,
              luck: 100,
              init: 100,
              speed: 100,
              maxHp: 300,
              hPower: 150,
              maestry: 100,
            }}
            color="#facc15"
          />

          <div style={{ width: 200 }}>
            <StatsBar stats={enemyView.stats} />
          </div>
        </div>

        {/* Skills */}
        <div>
          <h3>Skills</h3>
          <ul>
            {enemyView.skills.map((s) => (
              <li key={s.id}>
                {s.name} {s.cooldown > 0 && `(CD ${s.cooldown})`}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
