import FieldLabel from "./FieldLabel";
import "./layouts.css";

export default function SearchBar({
  value,
  onChange,
  placeholder = "Rechercher...",
  label = "",
  inputClassName = "",
  wrapperClassName = "",
}) {
  return (
    <div className={`sh-searchbar ${wrapperClassName}`.trim()}>
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-control sh-searchbar-input ${inputClassName}`.trim()}
      />
    </div>
  );
}
