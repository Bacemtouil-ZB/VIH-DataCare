//used for antecedents form 
import Toggle from "./Toggle";
export default function BoolGrid({ fields, data, onChange, disabled = false }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "2px 16px",
      }}
    >
      {fields.map((f) => {
        const current = !!data?.[f.key];
        return (
          <Toggle
            key={f.key}
            label={f.label}
            checked={current}
            disabled={disabled}
            onChange={() => onChange(f.key, !current)}
          />
        );
      })}
    </div>
  );
}