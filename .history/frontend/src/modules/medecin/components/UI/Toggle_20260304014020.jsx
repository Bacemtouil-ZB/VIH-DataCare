//used for antecedents form 

export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none",
        padding: "6px 0",
        opacity: disabled ? 0.75 : 1,
      }}
    >
      <div
        onClick={disabled ? undefined : onChange}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? "#1a7a5e" : "#d1d5db",
          position: "relative",
          transition: "background 0.2s",
          flexShrink: 0,
          pointerEvents: disabled ? "none" : "auto",
        }}
      >
        <div
          style={{
            width: 14,
            height: 14,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 3,
            left: checked ? 19 : 3,
            transition: "left 0.2s",
            boxShadow: "0 1px 3px rgba(0,0,0,.2)",
          }}
        />
      </div>
      <span style={{ fontSize: 13.5, color: "#374151" }}>{label}</span>
    </label>
  );
}