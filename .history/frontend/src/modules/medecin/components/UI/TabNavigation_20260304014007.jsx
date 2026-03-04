//used for antecedents form 

export default function TabNavigation({ sections, active, onChange }) {
  return (
    <div style={{ display: "flex", gap: 4, marginBottom: 20, background: "#fff", padding: 4, borderRadius: 9, border: "1px solid #e5e7eb", flexWrap: "wrap" }}>
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => onChange(s.id)}
          style={{
            flex: "1 1 auto",
            padding: "7px 12px",
            borderRadius: 7,
            border: "none",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 12.5,
            fontWeight: active === s.id ? 700 : 500,
            background: active === s.id ? "#1a7a5e" : "transparent",
            color: active === s.id ? "#fff" : "#6b7280",
            transition: "all .15s",
          }}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}