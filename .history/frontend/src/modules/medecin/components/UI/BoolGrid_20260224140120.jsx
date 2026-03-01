import Toggle from "./Toggle";

export default function BoolGrid({ fields, data, onChange }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "2px 16px" }}>
      {fields.map((f) => (
        <Toggle
          key={f.key}
          label={f.label}
          checked={data[f.key]}
          onChange={() => onChange(f.key, !data[f.key])}
        />
      ))}
    </div>
  );
}