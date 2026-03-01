  
export default function SectionCard({ title, children }) {
  return (
    <div className="section-card">
      <div className="section-header">
        <span>{title}</span>
      </div>
      <div className="section-body">{children}</div>
    </div>
  );
}