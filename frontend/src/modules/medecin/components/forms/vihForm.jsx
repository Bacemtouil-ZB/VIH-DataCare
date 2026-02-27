import { useState, useEffect } from "react";

const MODES_CONTAMINATION = ["A.E.S","Homosexuel","Bisexuel","Hémophile","Hétérosexuel","Mère/Nouveau-né","Toxicomanie IV","Transfusion","Hémophilie","Inconnu","Autre"];
const TYPES_DEPISTAGE = ["Trod", "Elisa", "Autres"];
const CIRCONSTANCES_DECOUVERTE = ["Proposition d'une association","Proposition à l'initiative du patient","Proposition du médecin","Demande du patient","Autres circonstances"];
const STADES_CDC = ["A0","A1","A2","A3","B0","B1","B2","B3","C0","C1","C2","C3"];

const FieldLabel = ({ children }) => (
  <label className="form-label small fw-bold text-uppercase text-secondary mb-1">{children}</label>
);

const GreenHeader = ({ title }) => (
  <div className="px-3 py-2 fw-bold text-white" style={{ background: "#2e7d52" }}>{title}</div>
);

const formatDate = (d) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : date.toISOString().split("T")[0];
};

// ── Multi-select déroulant avec badges verts ──────────────────────────────────
function MultiSelectContamination({ value, onChange, disabled }) {
  const [open, setOpen] = useState(false);
  const selected = Array.isArray(value) ? value : (value ? [value] : []);

  const toggle = (option) => {
    if (disabled) return;
    const next = selected.includes(option)
      ? selected.filter((v) => v !== option)
      : [...selected, option];
    onChange(next);
  };

  const remove = (option, e) => {
    e.stopPropagation();
    if (!disabled) onChange(selected.filter((v) => v !== option));
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Boîte principale */}
      <div
        className={`form-control d-flex flex-wrap gap-1 align-items-center ${disabled ? "bg-light" : ""}`}
        style={{ minHeight: 38, cursor: disabled ? "default" : "pointer", paddingRight: 32 }}
        onClick={() => !disabled && setOpen((o) => !o)}
      >
        {selected.length === 0 && (
          <span className="text-secondary" style={{ fontSize: "0.9rem" }}>-- Sélectionner --</span>
        )}
        {selected.map((opt) => (
          <span key={opt} className="badge d-flex align-items-center gap-1"
            style={{ background: "#2e7d52", color: "white", fontSize: "0.78rem", fontWeight: 600, borderRadius: 6, padding: "3px 8px" }}>
            {opt}
            {!disabled && (
              <span style={{ cursor: "pointer", fontSize: "1rem", lineHeight: 1 }} onClick={(e) => remove(opt, e)}>×</span>
            )}
          </span>
        ))}
        {/* Chevron */}
        <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "#6c757d", fontSize: "0.75rem", pointerEvents: "none" }}>
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* Dropdown */}
      {open && (
        <>
          {/* Overlay fermeture */}
          <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => setOpen(false)} />
          <div className="border rounded shadow-sm bg-white"
            style={{ position: "absolute", zIndex: 999, width: "100%", maxHeight: 240, overflowY: "auto", top: "calc(100% + 4px)" }}>
            {MODES_CONTAMINATION.map((opt) => {
              const checked = selected.includes(opt);
              return (
                <div key={opt}
                  className="px-3 py-2 d-flex align-items-center gap-2"
                  style={{ cursor: "pointer", background: checked ? "#f0fdf4" : "white", borderBottom: "1px solid #f1f5f9", fontSize: "0.9rem", transition: "background 0.1s" }}
                  onMouseEnter={(e) => { if (!checked) e.currentTarget.style.background = "#f8fafb"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = checked ? "#f0fdf4" : "white"; }}
                  onClick={(e) => { e.stopPropagation(); toggle(opt); }}>
                  <input type="checkbox" readOnly checked={checked}
                    style={{ accentColor: "#2e7d52", width: 15, height: 15, cursor: "pointer" }} />
                  <span style={{ color: checked ? "#166534" : "#1e293b", fontWeight: checked ? 600 : 400 }}>{opt}</span>
                  {checked && <span className="ms-auto" style={{ color: "#16a34a", fontSize: "0.8rem" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default function VihForm({ initialData = null, onSubmit, isLoading = false, errors = {}, isEditMode = true, isCreateMode = false }) {
  const [formData, setFormData] = useState({
    mode_contamination: [],
    type_depistage: "", circonstance_decouverte: "",
    date_derniere_negative: "", date_contamination: "", date_vih_positif: "",
    stade_cdc: "", debut_stade_c: "", typage_hla_b5701: "", profil_seroconversion: false,
  });

  useEffect(() => {
    if (initialData) {
      // Normalise mode_contamination : string CSV → array
      const mc = initialData.mode_contamination;
      const mcArray = Array.isArray(mc)
        ? mc
        : (mc ? mc.split(",").map((s) => s.trim()).filter(Boolean) : []);
      setFormData({
        mode_contamination:      mcArray,
        type_depistage:          initialData.type_depistage || "",
        circonstance_decouverte: initialData.circonstance_decouverte || "",
        date_derniere_negative:  formatDate(initialData.date_derniere_negative),
        date_contamination:      formatDate(initialData.date_contamination),
        date_vih_positif:        formatDate(initialData.date_vih_positif),
        stade_cdc:               initialData.stade_cdc || "",
        debut_stade_c:           formatDate(initialData.debut_stade_c),
        typage_hla_b5701:        initialData.typage_hla_b5701 || "",
        profil_seroconversion:   initialData.profil_seroconversion || false,
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
    // Sérialise mode_contamination array → string CSV pour le backend
    onSubmit({
      ...formData,
      mode_contamination: Array.isArray(formData.mode_contamination)
        ? formData.mode_contamination.join(", ")
        : formData.mode_contamination,
    });
  };

  const isDisabled = !isEditMode && !isCreateMode;
  const isStadeC   = formData.stade_cdc.startsWith("C");

  return (
    <div className="bg-white border rounded">
      <GreenHeader title={isCreateMode ? "Nouvelle fiche VIH" : "Fiche VIH"} />
      <form onSubmit={handleSubmit} className="p-4">
        <div className="row g-3">

          {/* ✅ Mode de contamination — multi-select */}
          <div className="col-md-6">
            <FieldLabel>Mode de contamination <span className="text-danger">*</span></FieldLabel>
            <MultiSelectContamination
              value={formData.mode_contamination}
              onChange={(val) => setFormData((prev) => ({ ...prev, mode_contamination: val }))}
              disabled={isDisabled || isLoading}
            />
            {errors.mode_contamination && (
              <div className="text-danger small mt-1">{errors.mode_contamination}</div>
            )}
            {/* ✅ Badges verts sous le champ */}
            {formData.mode_contamination.length > 0 && (
              <div className="d-flex flex-wrap gap-1 mt-2">
                {formData.mode_contamination.map((opt) => (
                  <span key={opt} className="badge"
                    style={{ background: "#dcfce7", color: "#166534", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #86efac", borderRadius: 6, padding: "3px 10px" }}>
                    {opt}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Type de dépistage */}
          <div className="col-md-6">
            <FieldLabel>Type de dépistage <span className="text-danger">*</span></FieldLabel>
            <select name="type_depistage" className={`form-select ${errors.type_depistage ? "is-invalid" : ""}`}
              value={formData.type_depistage} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {TYPES_DEPISTAGE.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.type_depistage && <div className="invalid-feedback">{errors.type_depistage}</div>}
          </div>

          {/* Circonstance de découverte */}
          <div className="col-12">
            <FieldLabel>Circonstance de découverte <span className="text-danger">*</span></FieldLabel>
            <select name="circonstance_decouverte" className={`form-select ${errors.circonstance_decouverte ? "is-invalid" : ""}`}
              value={formData.circonstance_decouverte} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {CIRCONSTANCES_DECOUVERTE.map(c => <option key={c}>{c}</option>)}
            </select>
            {errors.circonstance_decouverte && <div className="invalid-feedback">{errors.circonstance_decouverte}</div>}
          </div>

          {/* Date dernière négative */}
          <div className="col-md-6">
            <FieldLabel>Date dernière négative</FieldLabel>
            <input type="date" name="date_derniere_negative" className={`form-control ${errors.date_derniere_negative ? "is-invalid" : ""}`}
              value={formData.date_derniere_negative} onChange={handleChange} disabled={isDisabled || isLoading} />
            {errors.date_derniere_negative && <div className="invalid-feedback">{errors.date_derniere_negative}</div>}
          </div>

          {/* Date de contamination */}
          <div className="col-md-6">
            <FieldLabel>Date de contamination</FieldLabel>
            <input type="date" name="date_contamination" className={`form-control ${errors.date_contamination ? "is-invalid" : ""}`}
              value={formData.date_contamination} onChange={handleChange} disabled={isDisabled || isLoading} />
            {errors.date_contamination && <div className="invalid-feedback">{errors.date_contamination}</div>}
          </div>

          {/* Date VIH positif */}
          <div className="col-md-6">
            <FieldLabel>Date VIH positif <span className="text-danger">*</span></FieldLabel>
            <input type="date" name="date_vih_positif" className={`form-control ${errors.date_vih_positif ? "is-invalid" : ""}`}
              value={formData.date_vih_positif} onChange={handleChange} disabled={isDisabled || isLoading} required />
            {errors.date_vih_positif && <div className="invalid-feedback">{errors.date_vih_positif}</div>}
          </div>

          {/* Stade CDC */}
          <div className="col-md-6">
            <FieldLabel>Stade CDC <span className="text-danger">*</span></FieldLabel>
            <select name="stade_cdc" className={`form-select ${errors.stade_cdc ? "is-invalid" : ""}`}
              value={formData.stade_cdc} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {STADES_CDC.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.stade_cdc && <div className="invalid-feedback">{errors.stade_cdc}</div>}
          </div>

          {/* Début stade C — conditionnel */}
          {isStadeC && (
            <div className="col-md-6">
              <FieldLabel>Début stade C</FieldLabel>
              <input type="date" name="debut_stade_c" className={`form-control ${errors.debut_stade_c ? "is-invalid" : ""}`}
                value={formData.debut_stade_c} onChange={handleChange} disabled={isDisabled || isLoading} />
              {errors.debut_stade_c && <div className="invalid-feedback">{errors.debut_stade_c}</div>}
            </div>
          )}

          {/* Typage HLA-B5701 */}
          <div className="col-md-6">
            <FieldLabel>Typage HLA-B5701 <span className="text-danger">*</span></FieldLabel>
            <div className="d-flex gap-4 mt-1">
              {["Positif", "Négatif"].map(v => (
                <div key={v} className="form-check">
                  <input type="radio" className="form-check-input" name="typage_hla_b5701" id={`hla_${v}`}
                    value={v} checked={formData.typage_hla_b5701 === v} onChange={handleChange} disabled={isDisabled || isLoading} />
                  <label className="form-check-label" htmlFor={`hla_${v}`}>{v}</label>
                </div>
              ))}
            </div>
            {errors.typage_hla_b5701 && <div className="text-danger small mt-1">{errors.typage_hla_b5701}</div>}
          </div>

          {/* Profil de séroconversion */}
          <div className="col-md-6">
            <FieldLabel>Profil de séroconversion (Fiebig I à V)</FieldLabel>
            <div className="d-flex gap-4 mt-1">
              {[{ label: "Oui", val: true }, { label: "Non", val: false }].map(({ label, val }) => (
                <div key={label} className="form-check">
                  <input type="radio" className="form-check-input" id={`sero_${label}`}
                    checked={formData.profil_seroconversion === val}
                    onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: val }))}
                    disabled={isDisabled || isLoading} />
                  <label className="form-check-label" htmlFor={`sero_${label}`}>{label}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Bouton submit */}
          {(isEditMode || isCreateMode) && (
            <div className="col-12 mt-2">
              <button type="submit" className="btn w-100 text-white fw-bold py-2" style={{ background: "#2e7d52" }} disabled={isLoading}>
                {isLoading ? "Enregistrement..." : isCreateMode ? "Enregistrer la fiche VIH" : "Enregistrer les modifications"}
              </button>
            </div>
          )}

        </div>
      </form>
    </div>
  );
}