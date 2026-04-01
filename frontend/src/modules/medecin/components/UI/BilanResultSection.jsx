import { Input } from "../../../../shared/components";
import ToggleSwitch from "../buttons/ToggleSwitch";
import Textarea from "./Textarea";

const POSITIVE_NEGATIVE_SET = new Set(["positif", "negatif"]);
const FORCED_TOGGLE_FIELDS = new Set(["idr_tuberculine", "radio_resultat"]);

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const isPositiveNegativeField = (champ) => {
  if (champ?.type !== "select" || !Array.isArray(champ?.options) || champ.options.length !== 2) {
    return false;
  }

  const normalized = champ.options.map(normalize);
  return normalized.every((item) => POSITIVE_NEGATIVE_SET.has(item));
};

const isToggleField = (champ) => {
  if (isPositiveNegativeField(champ)) return true;
  return champ?.type === "select" && FORCED_TOGGLE_FIELDS.has(champ?.key);
};

const getCanonicalOption = (options, normalizedWanted) => {
  return options.find((opt) => normalize(opt) === normalizedWanted) || null;
};

const getToggleOptions = (champ) => {
  const options = champ?.options || [];

  if (champ?.key === "radio_resultat") {
    const falseOption = getCanonicalOption(options, "normal") || options[0] || "Normal";
    const trueOption = getCanonicalOption(options, "anomalie") || options[1] || "Anomalie";
    return { falseOption, trueOption };
  }

  if (champ?.key === "idr_tuberculine") {
    const falseOption = getCanonicalOption(options, "negatif") || options[0] || "Negatif";
    const trueOption = getCanonicalOption(options, "positif") || options[options.length - 1] || "Positif";
    return { falseOption, trueOption };
  }

  const falseOption = getCanonicalOption(options, "negatif") || options[0] || "Negatif";
  const trueOption = getCanonicalOption(options, "positif") || options[1] || "Positif";
  return { falseOption, trueOption };
};

function BinaryToggleField({ champ, value, onChange, disabled }) {
  const { falseOption, trueOption } = getToggleOptions(champ);
  const rawValue = value === null || value === undefined || String(value).trim() === ""
    ? falseOption
    : value;
  const normalizedValue = normalize(rawValue);
  const normalizedTrue = normalize(trueOption);

  const checked = normalizedValue === normalizedTrue;
  const displayLabel = checked ? trueOption : falseOption;

  return (
    <ToggleSwitch
      checked={checked}
      disabled={disabled}
      label={displayLabel}
      onChange={(nextChecked) => {
        const nextValue = nextChecked ? trueOption : falseOption;
        onChange({ target: { value: nextValue } });
      }}
    />
  );
}

function ChampResultat({ champ, value, onChange, disabled }) {
  const { label, type, unite, options = [] } = champ;
  const isWide = type === "textarea";

  const renderInput = () => {
    if (isToggleField(champ)) {
      return (
        <BinaryToggleField
          champ={champ}
          value={value}
          onChange={onChange}
          disabled={disabled}
        />
      );
    }

    if (type === "select") {
      return (
        <select className="form-select" value={value} onChange={onChange} disabled={disabled}>
          <option value="">- Selectionner -</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    if (type === "textarea") {
      return (
        <Textarea
          value={value}
          onChange={onChange}
          placeholder={label}
          disabled={disabled}
        />
      );
    }

    return (
      <div className="rb-input-unit">
        <Input
          type={type}
          className="form-control"
          value={value}
          onChange={onChange}
          placeholder="-"
          disabled={disabled}
        />
        {unite && <span className="rb-unite">{unite}</span>}
      </div>
    );
  };

  return (
    <div className={`rb-champ${isWide ? " rb-champ-wide" : ""}`}>
      <label>{label}</label>
      {renderInput()}
    </div>
  );
}

const formatDisplayDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("fr-FR");
};

export default function BilanResultSection({
  section,
  sectionKey,
  formData,
  field,
  disabled = false,
  showDetailDate = false,
}) {
  const dateKey = sectionKey ? `date_${sectionKey}` : null;
  const maxDate = new Date().toISOString().slice(0, 10);

  return (
    <div className="rb-section">
      <div className="rb-section-header">
        <div className="rb-section-title">
          <i className="bi bi-flask me-2" />
          {section.label}
        </div>

        {dateKey && (
          <div className="rb-section-date">
            <label htmlFor={`date-${sectionKey}`}>Date :</label>
            {disabled && showDetailDate ? (
              <Input
                type="text"
                className="form-control"
                value={formatDisplayDate(formData[dateKey])}
                disabled
                readOnly
              />
            ) : (
              <input
                id={`date-${sectionKey}`}
                type="date"
                value={formData[dateKey] || ""}
                onChange={field(dateKey)}
                disabled={disabled}
                max={maxDate}
                required
              />
            )}
          </div>
        )}
      </div>

      <div className="rb-champs-grid">
        {section.champs.map((champ) => (
          <ChampResultat
            key={champ.key}
            champ={champ}
            value={formData[champ.key] ?? ""}
            onChange={field(champ.key)}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
}

