export default function StatBar({
  label,
  value,
  max = 100,
  color = "#22d3ee",
}) {
  const percent = Math.min(100, (value / max) * 100);

  return (
    <div style={{ marginBottom: 8 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 12,
          marginBottom: 2,
        }}
      >
        <span>{label}</span>
        <span>{value}</span>
      </div>

      <div
        style={{
          height: 6,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            background: color,
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
