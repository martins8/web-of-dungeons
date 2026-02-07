function pickStyle(line) {
  if (line.includes("💥")) {
    return {
      color: "#facc15", // amarelo crítico
      background: "rgba(250,204,21,0.15)",
      fontWeight: "bold",
    };
  }

  if (line.includes("🩸")) {
    return {
      color: "#f87171",
      background: "rgba(248,113,113,0.15)",
    };
  }

  if (line.includes("esquivou")) {
    return {
      color: "#60a5fa",
      background: "rgba(96,165,250,0.15)",
    };
  }

  if (line.includes("⚔️")) {
    return {
      color: "#e5e7eb", // branco agradável
      background: "rgba(252, 250, 250, 0.1)",
    };
  }

  if (line.includes("morto")) {
    return {
      color: "#f9fafb",
      background: "rgba(0,0,0,0.4)",
      fontWeight: "bold",
    };
  }

  return {
    color: "#d1d5db",
  };
}

function formatLine(line) {
  if (line.includes("Rogue") && line.includes("Goblin")) {
    return line.replace("Rogue", "🧑‍🗡️").replace("Goblin", "👹");
  }
  if (line.includes("Rogue")) {
    return line.replace("Rogue", "🧑‍🗡️");
  }
  if (line.includes("Goblin")) {
    return line.replace("Goblin", "👹");
  }
  return line;
}

export default function CombatLog({ log }) {
  const lines = log.trim().split("\n");

  return (
    <section>
      <h2>Combat Log</h2>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          fontSize: 13,
          lineHeight: 1.4,
        }}
      >
        {lines.map((line, i) => (
          <li
            key={i}
            style={{
              marginBottom: 4,
              padding: "4px 6px",
              borderRadius: 4,
              background: pickStyle(line).background,
            }}
          >
            {formatLine(line)}
          </li>
        ))}
      </ul>
    </section>
  );
}
