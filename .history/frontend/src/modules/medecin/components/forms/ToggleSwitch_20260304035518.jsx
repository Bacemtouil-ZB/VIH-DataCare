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
  const rootStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "8px 10px",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    background: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.65 : 1,
    transition: "border-color 0.2s ease, background-color 0.2s ease",

    // ✅ removes the “white footer/flash” on tap (mobile Safari/Chrome)
    WebkitTapHighlightColor: "transparent",

    // ✅ prevent label outline
    outline: "none",
  };

  const sliderStyle = {
    width: "40px",
    height: "22px",
    borderRadius: "999px",
    background: checked ? "#2e7d52" : "#cbd5e1",
    position: "relative",
    flexShrink: 0,
    transition: "background-color 0.2s ease",
  };

  const knobStyle = {
    position: "absolute",
    top: "2px",
    left: "2px",
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    background: "#fff",
    transform: checked ? "translateX(18px)" : "translateX(0px)",
    transition: "transform 0.2s ease",
  };

  const textStyle = {
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    lineHeight: 1.25,
  };

  // Hidden input (accessible)
  const inputStyle = {
    position: "absolute",
    opacity: 0,
    width: "1px",
    height: "1px",
    margin: 0,
    padding: 0,
    border: 0,
    background: "transparent",
    appearance: "none",
    pointerEvents: "none",
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    overflow: "hidden",
  };

  return (
    <label htmlFor={id} style={rootStyle}>
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        style={inputStyle}
      />

      <span aria-hidden="true" style={sliderStyle}>
        <span style={knobStyle} />
      </span>

      <span style={textStyle}>{label}</span>
    </label>
  );
}