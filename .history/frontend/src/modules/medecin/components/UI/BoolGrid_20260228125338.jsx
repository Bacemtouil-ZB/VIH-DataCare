import Toggle from "./Toggle";

export default function BoolGrid({ fields, data, onChange }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "2px 16px",
      }}
    >
      {fields.map((f) => {
        const current = !!data?.[f.key]; // force boolean
        return (
          <Toggle
            key={f.key}
            label={f.label}
            checked={current}
            onChange={() => onChange(f.key, !current)}
          />
        );
      })}
    </div>
  );
}