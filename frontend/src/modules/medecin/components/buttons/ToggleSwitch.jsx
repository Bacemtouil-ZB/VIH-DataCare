import React from "react";
import "../forms/SocialForm.css";

export default function ToggleSwitch({
  id,
  label,
  checked = false,
  disabled = false,
  onChange,
}) {
  return (
    <label
      htmlFor={id}
      className={`toggle-switch ${checked ? "is-on" : ""} ${disabled ? "is-disabled" : ""}`}
    >
      <input
        id={id}
        type="checkbox"
        className="toggle-input"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
      />
      <span className="toggle-slider" aria-hidden="true" />
      <span className="toggle-text">{label}</span>
    </label>
  );
}
