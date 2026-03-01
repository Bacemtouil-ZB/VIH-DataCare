export default function TabNavigation({ sections, active, setActive }) {
  return (
    <div className="tabs">
      {sections.map(s => (
        <button
          key={s.id}
          onClick={() => setActive(s.id)}
          className={`tab-btn ${active === s.id ? "active" : ""}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}