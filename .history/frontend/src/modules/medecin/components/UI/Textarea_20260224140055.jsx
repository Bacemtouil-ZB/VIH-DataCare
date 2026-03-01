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

export default function Textarea({ value, onChange, placeholder }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={3}
      style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }}
      onFocus={(e) => (e.target.style.borderColor = "#1a7a5e")}
      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
    />
  );
}