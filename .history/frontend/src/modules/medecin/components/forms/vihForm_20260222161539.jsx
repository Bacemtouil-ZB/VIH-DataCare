<<<<<<< HEAD
export default function VihHistory({ history, currentVihId, onLoadVih }) {
  
  const formatDateOnly = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  if (!history || history.length === 0) {
    return null;
  }

  return (
    <div className="card shadow-sm mt-4">
      <div className="card-header bg-success bg-opacity-10 text-success d-flex justify-content-between align-items-center">
        <h6 className="mb-0 fw-normal">
          <i className="bi bi-clipboard2-data me-2"></i>
          Historique des fiches VIH
        </h6>
        <span className="badge bg-success bg-opacity-25 text-success">{history.length} fiche(s)</span>
      </div>
      
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-sm table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th className="text-center fw-normal" style={{width: "70px"}}>#</th>
                <th className="fw-normal">Mode contamination</th>
                <th className="fw-normal">Type dépistage</th>
                <th className="fw-normal">Circonstance découverte</th>
                <th className="text-center fw-normal">Date VIH+</th>
                <th className="text-center fw-normal">Stade CDC</th>
                <th className="text-center fw-normal">HLA-B5701</th>
                <th className="fw-normal">Créée par</th>
                <th className="text-center fw-normal" style={{width: "90px"}}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((entry, index) => {
                const isActive = entry.id === currentVihId;
                
                return (
                  <tr 
                    key={entry.id}
                    className={isActive ? "table-info" : ""}
                  >
                    <td className="text-center">
                      <span className="text-muted">#{history.length - index}</span>
                      {isActive && (
                        <div>
                          <span className="badge bg-info text-dark mt-1" style={{fontSize: "9px"}}>
                            AFFICHÉE
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="text-secondary">{entry.mode_contamination || "-"}</td>
                    <td className="text-secondary">{entry.type_depistage || "-"}</td>
                    <td className="text-secondary"><small>{entry.circonstance_decouverte || "-"}</small></td>
                    <td className="text-center">
                      <small className="text-muted">
                        {formatDateOnly(entry.date_vih_positif)}
                      </small>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.stade_cdc?.startsWith('A') ? 'bg-info bg-opacity-75' :
                        entry.stade_cdc?.startsWith('B') ? 'bg-warning bg-opacity-75 text-dark' :
                        entry.stade_cdc?.startsWith('C') ? 'bg-danger bg-opacity-75' : 'bg-secondary bg-opacity-75'
                      }`} style={{fontSize: "11px"}}>
                        {entry.stade_cdc || "-"}
                      </span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${
                        entry.typage_hla_b5701 === 'Positif' ? 'bg-danger bg-opacity-75' :
                        entry.typage_hla_b5701 === 'Négatif' ? 'bg-success bg-opacity-75' : 'bg-secondary bg-opacity-75'
                      }`} style={{fontSize: "11px"}}>
                        {entry.typage_hla_b5701 || "-"}
                      </span>
                    </td>
                    <td>
                      <small className="text-muted">
                        {entry.created_by_nom || "-"} {entry.created_by_prenom || ""}
                      </small>
                    </td>
                    <td className="text-center">
                      {!isActive && (
                        <button
                          onClick={() => onLoadVih(entry)}
                          className="btn btn-sm btn-outline-secondary"
                          title="Charger cette fiche"
                          style={{fontSize: "12px", padding: "2px 8px"}}
                        >
                          <i className="bi bi-eye"></i> Voir
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
=======
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

export default function VihForm({ initialData = null, onSubmit, isLoading = false, errors = {}, isEditMode = true, isCreateMode = false }) {
  const [formData, setFormData] = useState({
    mode_contamination: "", type_depistage: "", circonstance_decouverte: "",
    date_derniere_negative: "", date_contamination: "", date_vih_positif: "",
    stade_cdc: "", debut_stade_c: "", typage_hla_b5701: "", profil_seroconversion: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        mode_contamination:       initialData.mode_contamination || "",
        type_depistage:           initialData.type_depistage || "",
        circonstance_decouverte:  initialData.circonstance_decouverte || "",
        date_derniere_negative:   formatDate(initialData.date_derniere_negative),
        date_contamination:       formatDate(initialData.date_contamination),
        date_vih_positif:         formatDate(initialData.date_vih_positif),
        stade_cdc:                initialData.stade_cdc || "",
        debut_stade_c:            formatDate(initialData.debut_stade_c),
        typage_hla_b5701:         initialData.typage_hla_b5701 || "",
        profil_seroconversion:    initialData.profil_seroconversion || false,
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

  const isDisabled = !isEditMode && !isCreateMode;
  const isStadeC   = formData.stade_cdc.startsWith("C");

  return (
    <div className="bg-white border rounded">
      <GreenHeader title="Nouvelle fiche VIH" />
      <form onSubmit={e => { e.preventDefault(); onSubmit(formData); }} className="p-4">
        <div className="row g-3">

          {/* Mode de contamination */}
          <div className="col-md-6">
            <FieldLabel>Mode de contamination <span className="text-danger">*</span></FieldLabel>
            <select name="mode_contamination" className={`form-select ${errors.mode_contamination ? "is-invalid" : ""}`}
              value={formData.mode_contamination} onChange={handleChange} disabled={isDisabled || isLoading} required>
              <option value="">-- Sélectionner --</option>
              {MODES_CONTAMINATION.map(m => <option key={m}>{m}</option>)}
            </select>
            {errors.mode_contamination && <div className="invalid-feedback">{errors.mode_contamination}</div>}
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

          {/* Bouton */}
          {(isEditMode || isCreateMode) && (
            <div className="col-12 mt-2">
              <button type="submit" className="btn w-100 text-white fw-bold py-2" style={{ background: "#2e7d52" }} disabled={isLoading}>
                {isLoading ? "Enregistrement..." : isCreateMode ? "Enregistrer la fiche VIH" : " Enregistrer les modifications"}
              </button>
            </div>
          )}

        </div>
      </form>
>>>>>>> origin/feature/vih
    </div>
  );
}