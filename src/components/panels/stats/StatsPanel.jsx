import StatBar from "./StatBar";

export default function StatsPanel({ title, data, maxMap = {}, color }) {
  return (
    <section style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 8 }}>{title}</h3>

      {Object.entries(data).map(([key, value]) => (
        <StatBar
          key={key}
          label={key.toUpperCase()}
          value={value}
          max={maxMap[key] ?? 100}
          color={color}
        />
      ))}
    </section>
  );
}
