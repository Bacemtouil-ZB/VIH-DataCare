export default function Toggle({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none", padding: "6px 0" }}>
      <div
        onClick={onChange}
        style={{
          width: 36, height: 20, borderRadius: 10, background: checked ? "#1a7a5e" : "#d1d5db",
          position: "relative", transition: "background 0.2s", flexShrink: 0,
        }}
      >
        <div style={{
          width: 14, height: 14, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, left: checked ? 19 : 3, transition: "left 0.2s",
          boxShadow: "0 1px 3px rgba(0,0,0,.2)"
        }} />
      </div>
      <span style={{ fontSize: 13.5, color: "#374151" }}>{label}</span>
    </label>
  );
}