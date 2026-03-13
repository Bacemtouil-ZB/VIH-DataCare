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
  as,
  rows,
  children,
  onFocus,
  onBlur,
  ...rest
}) {
  return (
    <Form.Control
      id={id}
      name={name}
      as={as}
      rows={rows}
      type={type}
      min={min}
      max={max}
      step={step}
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${className} custom-input`}
      style={{
        ...customInputStyle,
        background: disabled ? "#f3f4f6" : customInputStyle.background,
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.9 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "#1a7a5e";
        if (onFocus) onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "#e5e7eb";
        if (onBlur) onBlur(e);
      }}
      {...rest}
    >
      {children}
    </Form.Control>
  );
}
