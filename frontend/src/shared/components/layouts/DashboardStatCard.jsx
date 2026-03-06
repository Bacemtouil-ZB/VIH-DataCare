import "./layouts.css";

export default function DashboardStatCard({ label, value, tone = "success" }) {
  return (
    <div className="sh-stat-card">
      <span className="sh-stat-label">{label}</span>
      <strong className={`sh-stat-value sh-stat-${tone}`}>{value}</strong>
    </div>
  );
}
