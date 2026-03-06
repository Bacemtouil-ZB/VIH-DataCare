export default function FieldLabel({ children, required = false, className = "" }) {
  return (
    <label
      className={`form-label fw-bold text-uppercase text-secondary mb-1 ${className}`.trim()}
      style={{ fontSize: "0.7rem" }}
    >
      {children}
      {required ? (
        <span style={{ color: "#dc3545", fontWeight: 800 }}>
          {" "}*
        </span>
      ) : null}
    </label>
  );
}
