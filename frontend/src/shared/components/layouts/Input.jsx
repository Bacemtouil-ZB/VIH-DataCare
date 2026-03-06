const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  fontSize: 13.5,
  color: "#111827",
  background: "#fafafa",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color .15s",
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
    <input
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
      className={className}
      style={{
        ...inputStyle,
        background: disabled ? "#f3f4f6" : inputStyle.background,
        cursor: disabled ? "not-allowed" : "text",
        opacity: disabled ? 0.9 : 1,
      }}
      onFocus={(e) => {
        if (!disabled) e.target.style.borderColor = "#1a7a5e";
      }}
      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
    />
  );
}
