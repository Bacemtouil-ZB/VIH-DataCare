import { useState, useEffect } from "react";
import {MODES_CONTAMINATION,TYPES_DEPISTAGE,CIRCONSTANCES_DECOUVERTE,STADES_CDC,FORM_INIT,formatDate,normalizeModesContamination,
  serializeModesContamination,
} from "./vihConfig";
import "./VihForm.css";
import { ActionButton, FieldLabel, Input } from "../../../../../shared/components/layouts";

function MultiSelectContamination({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = Array.isArray(value) ? value : (value ? [value] : []);

  const toggle = (option) => {
    if (disabled) return;
    onChange(selected.includes(option) ? selected.filter((v) => v !== option) : [...selected, option]);
  };

  const remove = (option, e) => {
    e.stopPropagation();
    if (!disabled) onChange(selected.filter((v) => v !== option));
  };

  return (
    <div className="multiselect-wrapper">
      <div
        className={`form-control multiselect-box ${disabled ? "bg-light" : ""}`}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        {selected.length === 0
          ? <span className="multiselect-placeholder">-- Sélectionner --</span>
          : <span className="multiselect-count">{selected.length} sélectionné(s)</span>
        }
        <span className="multiselect-chevron">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <>
          <div className="multiselect-overlay" onClick={() => setOpen(false)} />
          <div className="multiselect-dropdown">
            {MODES_CONTAMINATION.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <div
                  key={opt}
                  className={`multiselect-option ${checked ? "checked" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggle(opt); }}
                >
                  <input type="checkbox" readOnly checked={checked} className="multiselect-checkbox" />
                  <span className={checked ? "option-checked" : ""}>{opt}</span>
                  {checked && <span className="option-tick ms-auto">✓</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function VihForm({
  initialData = null,
  onSubmit,
  onEdit,
  onCancel,
  isLoading = false,
  errors = {},
  isEditMode = true,
  isCreateMode = false,
}) {
  const [formData, setFormData] = useState(FORM_INIT);

  useEffect(() => {
    if (initialData) {
      setFormData({
        mode_contamination:      normalizeModesContamination(initialData.mode_contamination),
        type_depistage:          initialData.type_depistage || "",
        circonstance_decouverte: initialData.circonstance_decouverte || "",
        date_derniere_negative:  formatDate(initialData.date_derniere_negative),
        date_contamination:      formatDate(initialData.date_contamination),
        date_vih_positif:        formatDate(initialData.date_vih_positif),
        stade_cdc:               initialData.stade_cdc || "",
        debut_stade_c:           formatDate(initialData.debut_stade_c),
        typage_hla_b5701:        initialData.typage_hla_b5701 || "",
        profil_seroconversion:   initialData.profil_seroconversion ,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => {
      const next = { ...prev, [name]: type === "checkbox" ? checked : value };
      if (name === "stade_cdc" && !value.startsWith("C")) next.debut_stade_c = "";
      return next;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...formData, mode_contamination: serializeModesContamination(formData.mode_contamination) });
  };

  const isDisabled = !isEditMode && !isCreateMode;
  const isStadeC   = formData.stade_cdc.startsWith("C");

  return (
    <div className="bg-white border rounded">


      <form onSubmit={handleSubmit} className="p-4">
        <div className="row g-3">

          <div className="col-md-6">
            <FieldLabel required>Mode de contamination</FieldLabel>
            <MultiSelectContamination
              value={formData.mode_contamination}
              onChange={(val) => setFormData((prev) => ({ ...prev, mode_contamination: val }))}
              disabled={isDisabled || isLoading}
            />
            {errors.mode_contamination && <div className="text-danger small mt-1">{errors.mode_contamination}</div>}
            {formData.mode_contamination.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {formData.mode_contamination.map((opt) => (
                  <span key={opt} className="badge-light-green">
                    {opt}
                    {!(isDisabled || isLoading) && (
                      <span className="badge-light-remove"
                        onClick={() => setFormData(prev => ({ ...prev, mode_contamination: prev.mode_contamination.filter(v => v !== opt) }))}>
                        ×
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="col-md-6">
            <FieldLabel required>Type de dépistage</FieldLabel>
            <select name="type_depistage" className={`form-select ${errors.type_depistage ? "is-invalid" : ""}`}
              value={formData.type_depistage} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {TYPES_DEPISTAGE.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.type_depistage && <div className="invalid-feedback">{errors.type_depistage}</div>}
          </div>

          <div className="col-12">
            <FieldLabel required>Circonstance de découverte</FieldLabel>
            <select name="circonstance_decouverte" className={`form-select ${errors.circonstance_decouverte ? "is-invalid" : ""}`}
              value={formData.circonstance_decouverte} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {CIRCONSTANCES_DECOUVERTE.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.circonstance_decouverte && <div className="invalid-feedback">{errors.circonstance_decouverte}</div>}
          </div>

          <div className="col-md-6">
            <FieldLabel>Date dernière négative</FieldLabel>
            <Input
              type="date"
              name="date_derniere_negative"
              className={errors.date_derniere_negative ? "is-invalid" : ""}
              value={formData.date_derniere_negative}
              onChange={handleChange}
              disabled={isDisabled || isLoading}
            />
            {errors.date_derniere_negative && <div className="invalid-feedback">{errors.date_derniere_negative}</div>}
          </div>

          <div className="col-md-6">
            <FieldLabel>Date de contamination</FieldLabel>
            <Input
              type="date"
              name="date_contamination"
              className={errors.date_contamination ? "is-invalid" : ""}
              value={formData.date_contamination}
              onChange={handleChange}
              disabled={isDisabled || isLoading}
            />
            {errors.date_contamination && <div className="invalid-feedback">{errors.date_contamination}</div>}
          </div>

          <div className="col-md-6">
            <FieldLabel required>Date VIH positif</FieldLabel>
            <Input
              type="date"
              name="date_vih_positif"
              className={errors.date_vih_positif ? "is-invalid" : ""}
              value={formData.date_vih_positif}
              onChange={handleChange}
              disabled={isDisabled || isLoading}
              required
            />
            {errors.date_vih_positif && <div className="invalid-feedback">{errors.date_vih_positif}</div>}
          </div>

          <div className="col-md-6">
            <FieldLabel required>Stade CDC</FieldLabel>
            <select name="stade_cdc" className={`form-select ${errors.stade_cdc ? "is-invalid" : ""}`}
              value={formData.stade_cdc} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {STADES_CDC.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.stade_cdc && <div className="invalid-feedback">{errors.stade_cdc}</div>}
          </div>

          {isStadeC && (
            <div className="col-md-6">
              <FieldLabel>Début stade C</FieldLabel>
              <Input
                type="date"
                name="debut_stade_c"
                className={errors.debut_stade_c ? "is-invalid" : ""}
                value={formData.debut_stade_c}
                onChange={handleChange}
                disabled={isDisabled || isLoading}
              />
              {errors.debut_stade_c && <div className="invalid-feedback">{errors.debut_stade_c}</div>}
            </div>
          )}

          <div className="col-md-6">
            <FieldLabel required>Typage HLA-B5701</FieldLabel>
            <div className="d-flex gap-3 mt-2 vih-radio-group">
              {["Positif", "Négatif"].map(v => (
                <div key={v} className="form-check vih-radio-item">
                  <input type="radio" className="form-check-input" name="typage_hla_b5701" id={`hla_${v}`}
                    value={v} checked={formData.typage_hla_b5701 === v} onChange={handleChange} disabled={isDisabled || isLoading} />
                  <label className="form-check-label" htmlFor={`hla_${v}`}>{v}</label>
                </div>
              ))}
            </div>
            {errors.typage_hla_b5701 && <div className="text-danger small mt-1">{errors.typage_hla_b5701}</div>}
          </div>

          <div className="col-md-6">
            <FieldLabel>Profil de séroconversion (Fiebig I à V)</FieldLabel>
            <div className="d-flex gap-3 mt-2 vih-radio-group">
              {[{ label: "Oui", val: true }, { label: "Non", val: false }].map(({ label, val }) => (
                <div key={label} className="form-check vih-radio-item">
                  <input type="radio" className="form-check-input" id={`sero_${label}`}
                    checked={formData.profil_seroconversion === val}
                    onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: val }))}
                    disabled={isDisabled || isLoading} />
                  <label className="form-check-label" htmlFor={`sero_${label}`}>{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="col-12 mt-2">
            {!isEditMode && !isCreateMode ? (
              <ActionButton type="button" action="edit" label="Modifier" onClick={onEdit} />
            ) : (
              <div className="edit-actions">
                <ActionButton
                  type="submit"
                  action="save"
                  label={
                    isLoading
                      ? "Enregistrement..."
                      : isCreateMode
                        ? "Enregistrer la fiche VIH"
                        : "Enregistrer"
                  }
                  disabled={isLoading}
                  showIcon={false}
                />
                {!isCreateMode && (
                  <ActionButton
                    type="button"
                    action="annuler"
                    label="Annuler"
                    onClick={onCancel}
                    disabled={isLoading}
                    showIcon={false}
                  />
                )}
              </div>
            )}
          </div>

        </div>
      </form>
    </div>
  );
}
