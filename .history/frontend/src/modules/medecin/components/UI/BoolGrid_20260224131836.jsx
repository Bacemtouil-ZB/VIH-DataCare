  import Toggle from "./Toggle";

export default function BoolGrid({ fields, data, onChange }) {
  return (
    <div className="bool-grid">
      {fields.map(f => (
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