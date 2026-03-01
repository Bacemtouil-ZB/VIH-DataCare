export default function SectionCard({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid #f3f4f6", background: "#f9fafb" }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#1a7a5e", textTransform: "uppercase", letterSpacing: ".06em" }}>
          {title}
        </span>
      </div>
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  );
}