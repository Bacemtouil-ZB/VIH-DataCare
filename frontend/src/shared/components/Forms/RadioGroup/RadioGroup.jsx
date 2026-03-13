export default function RadioGroup({
  name,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  className = "",
  itemClassName = "",
  inputClassName = "",
  labelTextClassName = "",
}) {
  return (
    <div className={className}>
      {options.map((opt) => (
        <label key={opt.value} className={itemClassName}>
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={inputClassName}
          />
          <span className={labelTextClassName}>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
