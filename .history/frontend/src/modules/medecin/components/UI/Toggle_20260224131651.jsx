  import "../../pages/workspace/Antecedents/Antecedent.css"; // Import the CSS file for styling

export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <div
        onClick={onChange}
        className={`toggle-switch ${checked ? "active" : ""}`}
      >
        <div className="toggle-circle" />
      </div>
      <span className="toggle-label">{label}</span>
    </label>
  );
}