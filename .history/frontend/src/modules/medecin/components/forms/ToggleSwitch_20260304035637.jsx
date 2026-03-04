// import React from "react";

// export default function ToggleSwitch({
//   id,
//   label,
//   checked = false,
//   disabled = false,
//   onChange,
// }) {
//   return (
//     <label
//       htmlFor={id}
//       className={`toggle-switch ${checked ? "is-on" : ""} ${disabled ? "is-disabled" : ""}`}
//     >
//       <input
//         id={id}
//         type="checkbox"
//         className="toggle-input"
//         checked={checked}
//         disabled={disabled}
//         onChange={(e) => onChange?.(e.target.checked)}
//       />
//       <span className="toggle-slider" aria-hidden="true" />
//       <span className="toggle-text">{label}</span>
//     </label>
//   );
// }
import React from "react";

export default function ToggleSwitch({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
}) {
  const wrapperStyle = {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    background: "#fff",
    opacity: disabled ? 0.65 : 1,
    WebkitTapHighlightColor: "transparent",
    userSelect: "none",
  };

  const buttonStyle = {
    width: 40,
    height: 22,
    borderRadius: 999,
    border: "none",
    padding: 0,
    background: checked ? "#2e7d52" : "#cbd5e1",
    position: "relative",
    flexShrink: 0,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.2s ease",
    outline: "none",
    WebkitTapHighlightColor: "transparent",
  };

  const knobStyle = {
    position: "absolute",
    top: 2,
    left: 2,
    width: 18,
    height: 18,
    borderRadius: "50%",
    background: "#fff",
    transform: checked ? "translateX(18px)" : "translateX(0px)",
    transition: "transform 0.2s ease",
  };

  const textStyle = {
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    lineHeight: 1.25,
  };

  return (
    <div style={wrapperStyle} aria-disabled={disabled}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        style={buttonStyle}
        onClick={() => {
          if (disabled) return;
          onChange?.(!checked);
        }}
        // extra safety against focus/scroll on mobile
        onMouseDown={(e) => e.preventDefault()}
        onTouchStart={(e) => e.preventDefault()}
      >
        <span aria-hidden="true" style={knobStyle} />
      </button>

      <span style={textStyle}>{label}</span>
    </div>
  );
}