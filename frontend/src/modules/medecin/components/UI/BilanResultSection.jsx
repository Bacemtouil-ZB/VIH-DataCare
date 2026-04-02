import { FieldError, Input } from "../../../../shared/components";
import { Link } from "react-router-dom";
import { useId } from "react";
import ToggleSwitch from "../buttons/ToggleSwitch";
import Textarea from "./Textarea";

const POS_NEG_CONFIG = { falseValue: "Negatif", trueValue: "Positif" };

const normalize = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const isPositiveNegativeOptions = (options = []) => {
  if (!Array.isArray(options) || options.length !== 2) return false;
  const values = options.map(normalize);
  return values.includes("positif") && values.includes("negatif");
};

const getToggleConfig = (champ) => {
  if (champ?.type !== "select") return null;
  if (isPositiveNegativeOptions(champ.options)) return POS_NEG_CONFIG;
  return null;
};

const formatDateForDetails = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("fr-FR");
};

function ToggleField({ value, onChange, disabled, config }) {
  const currentValue =
    value === null || value === undefined || String(value).trim() === ""
      ? config.falseValue
      : value;

  const checked = normalize(currentValue) === normalize(config.trueValue);

  return (
    <ToggleSwitch
      checked={checked}
      disabled={disabled}
      label={checked ? config.trueValue : config.falseValue}
      onChange={(nextChecked) =>
        onChange({
          target: { value: nextChecked ? config.trueValue : config.falseValue },
        })
      }
    />
  );
}

function ChampResultat({ champ, value, onChange, disabled, error }) {
  const toggleConfig = getToggleConfig(champ);
  const isWide = champ.type === "textarea";

  return (
    <div className={`rb-champ${isWide ? " rb-champ-wide" : ""}`}>
      <label>{champ.label}</label>
      <div className="rb-field-control">
        {toggleConfig && (
          <ToggleField value={value} onChange={onChange} disabled={disabled} config={toggleConfig} />
        )}

        {!toggleConfig && champ.type === "select" && (
          <select className="form-select" value={value} onChange={onChange} disabled={disabled}>
            <option value="">- Selectionner -</option>
            {champ.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}

        {!toggleConfig && champ.type === "textarea" && (
          <Textarea value={value} onChange={onChange} placeholder={champ.label} disabled={disabled} />
        )}

        {!toggleConfig && champ.type !== "select" && champ.type !== "textarea" && (
          <div className="rb-input-unit">
            <Input
              type={champ.type}
              className="form-control"
              value={value}
              onChange={onChange}
              placeholder="-"
              disabled={disabled}
              required={!disabled && champ.type === "number"}
            />
            {champ.unite && <span className="rb-unite">{champ.unite}</span>}
          </div>
        )}

        <FieldError error={error} />
      </div>
    </div>
  );
}

function ChampFichier({
  champ,
  value,
  disabled,
  error,
  onFileChange,
  genotypageViewPath,
}) {
  const inputId = useId();

  return (
    <div className="rb-champ rb-champ-wide">
      <label>{champ.label}</label>
      <div className="rb-field-control">
        <div className="rb-input-unit">
          {!disabled && (
            <>
              <input
                id={inputId}
                type="file"
                accept={champ.accept || "image/*,application/pdf"}
                style={{ display: "none" }}
                onChange={(e) => onFileChange?.(champ.key, e.target.files?.[0] || null)}
              />
              <label htmlFor={inputId} className="btn btn-sm btn-outline-secondary mb-0">
                Choisir un fichier
              </label>
            </>
          )}

          {value && (
            <Link
              to={genotypageViewPath}
              state={{ scanUrl: value }}
              className="btn btn-sm btn-outline-success"
            >
              Consulter
            </Link>
          )}
        </div>

        <FieldError error={error} />
      </div>
    </div>
  );
}

export default function BilanResultSection({
  section,
  sectionKey,
  formData,
  errors = {},
  field,
  disabled = false,
  showDetailDate = false,
  onFileChange,
  genotypageViewPath,
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
            <div className="rb-date-control">
              {disabled && showDetailDate ? (
                <Input
                  type="text"
                  className="form-control"
                  value={formatDateForDetails(formData[dateKey])}
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

              <FieldError error={errors[dateKey]} />
            </div>
          </div>
        )}
      </div>

      <div className="rb-champs-grid">
        {section.champs.map((champ) =>
          champ.type === "file" ? (
            <ChampFichier
              key={champ.key}
              champ={champ}
              value={formData[champ.key] ?? ""}
              disabled={disabled}
              error={errors[champ.key]}
              onFileChange={onFileChange}
              genotypageViewPath={genotypageViewPath}
            />
          ) : (
            <ChampResultat
              key={champ.key}
              champ={champ}
              value={formData[champ.key] ?? ""}
              onChange={field(champ.key)}
              disabled={disabled}
              error={errors[champ.key]}
            />
          ),
        )}
      </div>
    </div>
  );
}
