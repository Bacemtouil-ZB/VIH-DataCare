import React from "react";
import { Form } from "react-bootstrap";

const customInputStyle = {
  background: "#fafafa",
  fontSize: "13.5px",
  color: "#111827",
  borderRadius: "6px",
  borderColor: "#e5e7eb",
  padding: "8px 10px",
  transition: "border-color .15s",
  boxSizing: "border-box",
};

export default function Input({
  value,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  className = "",
  min,
  max,
  step,
  name,
  id,
}) {
  return (
    <Form.Control
      id={id}
      name={name}
      type={type}
      min={min}
      max={max}
      step={step}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${className} custom-input`} // Ajout d'une classe personnalisée
      style={{
        ...customInputStyle,
        background: disabled ? "#f3f4f6" : customInputStyle.background,
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.9 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "#1a7a5e"; // Changement de couleur du border au focus
      }}
      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")} // Couleur par défaut au blur
    />
  );
}
