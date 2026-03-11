export default function Badge({ bg, color, children }) {
  return (
    <span className="badge" style={{ background: bg, color, fontSize: "0.82rem", fontWeight: 600 }}>
      {children}
    </span>
  );
}
