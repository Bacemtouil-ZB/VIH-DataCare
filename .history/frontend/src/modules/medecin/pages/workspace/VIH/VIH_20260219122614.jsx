import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../../../../shared/utils/api";
import * as vihService from "../../../services/vihService";

// ─── Constantes ──────────────────────────────────────────────────────────────
const MODES_CONTAMINATION = [
  "A.E.S", "Homosexuel", "Bisexuel", "Hémophile", "Hétérosexuel",
  "Mère/Nouveau-né", "Toxicomanie IV", "Transfusion", "Hémophilie", "Inconnu", "Autre"
];
const TYPES_DEPISTAGE = ["Trod", "Elisa", "Autres"];
const CIRCONSTANCES_DECOUVERTE = [
  "Proposition d'une association",
  "Proposition à l'initiative du patient",
  "Proposition du médecin",
  "Demande du patient",
  "Autres circonstances"
];
const STADES_CDC = [
  "A0","A1","A2","A3",
  "B0","B1","B2","B3",
  "C0","C1","C2","C3"
];

const EMPTY_FORM = {
  mode_contamination: [],
  type_depistage: "",
  circonstance_decouverte: "",
  date_derniere_negative: "",
  date_contamination: "",
  date_vih_positif: "",
  stade_cdc: "",
  debut_stade_c: "",
  typage_hla_b5701: "",
  profil_seroconversion: false,
};

// ─── Multi-select dropdown component ─────────────────────────────────────────
function MultiSelectDropdown({ options, selected, onChange, disabled, placeholder = "-- Sélectionner --" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (option) => {
    if (disabled) return;
    const next = selected.includes(option)
      ? selected.filter(o => o !== option)
      : [...selected, option];
    onChange(next);
  };

  const displayText = selected.length > 0 ? selected.join(", ") : placeholder;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <div
        className="form-select vih-hover-field"
        onClick={() => !disabled && setOpen(o => !o)}
        style={{
          cursor: disabled ? "default" : "pointer",
          backgroundColor: disabled ? "#e9ecef" : "#fff",
          color: selected.length === 0 ? "#6c757d" : "#212529",
          userSelect: "none",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "38px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>{displayText}</span>
        <i className={`bi bi-chevron-${open ? "up" : "down"} ms-2`} style={{ flexShrink: 0 }}></i>
      </div>

      {open && !disabled && (
        <div style={{
          position: "absolute",
          top: "100%",
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "#fff",
          border: "1px solid #86efac",
          borderRadius: "0.375rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
          maxHeight: "220px",
          overflowY: "auto",
        }}>
          {options.map(opt => (
            <div
              key={opt}
              onClick={() => toggle(opt)}
              style={{
                padding: "8px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                backgroundColor: selected.includes(opt) ? "#f0fdf4" : "transparent",
                color: selected.includes(opt) ? "#166534" : "#212529",
                fontWeight: selected.includes(opt) ? 600 : 400,
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#f0fdf4"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = selected.includes(opt) ? "#f0fdf4" : "transparent"}
            >
              <div style={{
                width: "18px", height: "18px", border: "2px solid",
                borderColor: selected.includes(opt) ? "#16a34a" : "#9ca3af",
                borderRadius: "4px", backgroundColor: selected.includes(opt) ? "#16a34a" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {selected.includes(opt) && <i className="bi bi-check" style={{ color: "#fff", fontSize: "11px" }}></i>}
              </div>
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Composant Principal ──────────────────────────────────────────────────────
export default function VihPage() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState(null);
  const [currentVih, setCurrentVih] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // Chargement patient
  useEffect(() => {
    if (!numero) return;
    (async () => {
      try {
        setIsLoadingPatient(true);
        const res = await API.get(`/patients/numero/${numero}`);
        if (res.data?.patient) setPatientId(res.data.patient.id);
        else toast.error("Patient non trouvé");
      } catch {
        toast.error("Impossible de récupérer les informations du patient");
      } finally {
        setIsLoadingPatient(false);
      }
    })();
  }, [numero]);

  const loadVihData = async () => {
    try {
      const vih = await vihService.getVihByPatient(patientId);
      if (vih) {
        setCurrentVih(vih);
        setIsEditing(false);
      } else {
        setCurrentVih(null);
        setIsEditing(true); // Nouveau patient → formulaire actif par défaut
      }
    } catch (err) {
      console.error("Erreur chargement données VIH:", err);
      toast.error("Erreur lors du chargement des données");
    }
  };

  // Chargement données VIH
  useEffect(() => {
    if (patientId) loadVihData();
  }, [patientId]);

  // Sync formulaire avec données existantes
  useEffect(() => {
    if (currentVih) {
      // Parse mode_contamination: peut être une string séparée par virgules ou un tableau
      let modeContam = currentVih.mode_contamination || [];
      if (typeof modeContam === "string") {
        modeContam = modeContam.split(",").map(s => s.trim()).filter(Boolean);
      }
      setFormData({
        mode_contamination: modeContam,
        type_depistage: currentVih.type_depistage || "",
        circonstance_decouverte: currentVih.circonstance_decouverte || "",
        date_derniere_negative: formatDateForInput(currentVih.date_derniere_negative),
        date_contamination: formatDateForInput(currentVih.date_contamination),
        date_vih_positif: formatDateForInput(currentVih.date_vih_positif),
        stade_cdc: currentVih.stade_cdc || "",
        debut_stade_c: formatDateForInput(currentVih.debut_stade_c),
        typage_hla_b5701: currentVih.typage_hla_b5701 || "",
        profil_seroconversion: currentVih.profil_seroconversion || false,
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [currentVih]);

  const formatDateForInput = (dateStr) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleModeContaminationChange = (selected) => {
    setFormData(p => ({ ...p, mode_contamination: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Enregistrement en cours...");
    try {
      setIsLoading(true);
      // Sérialiser mode_contamination en string séparée par virgules pour l'API
      const payload = {
        ...formData,
        mode_contamination: formData.mode_contamination.join(", "),
      };

      if (currentVih) {
        await vihService.updateVih(currentVih.id, payload);
        toast.success("Fiche VIH mise à jour", { id: tid });
      } else {
        await vihService.createVih({ ...payload, patient_id: patientId });
        toast.success("Fiche VIH créée avec succès", { id: tid });
      }

      await loadVihData();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const errs = err.response?.data?.errors;
      if (Array.isArray(errs)) {
        toast.error("Erreurs de validation", { id: tid });
        errs.forEach((e, i) => setTimeout(() =>
          toast.error(`${e.field}: ${e.message}`, { duration: 5000 }), i * 120));
      } else {
        toast.error(err.response?.data?.message || "Une erreur s'est produite", { id: tid });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    toast.success("Mode édition activé");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Restaurer les données originales
    if (currentVih) {
      let modeContam = currentVih.mode_contamination || [];
      if (typeof modeContam === "string") {
        modeContam = modeContam.split(",").map(s => s.trim()).filter(Boolean);
      }
      setFormData({
        mode_contamination: modeContam,
        type_depistage: currentVih.type_depistage || "",
        circonstance_decouverte: currentVih.circonstance_decouverte || "",
        date_derniere_negative: formatDateForInput(currentVih.date_derniere_negative),
        date_contamination: formatDateForInput(currentVih.date_contamination),
        date_vih_positif: formatDateForInput(currentVih.date_vih_positif),
        stade_cdc: currentVih.stade_cdc || "",
        debut_stade_c: formatDateForInput(currentVih.debut_stade_c),
        typage_hla_b5701: currentVih.typage_hla_b5701 || "",
        profil_seroconversion: currentVih.profil_seroconversion || false,
      });
    }
    toast.success("Modifications annulées");
  };

  const isReadOnly = currentVih && !isEditing;

  // ─── Rendu ───────────────────────────────────────────────────────────────────
  if (isLoadingPatient) return (
    <div className="container mt-5 text-center">
      <Toaster position="top-right" />
      <div className="spinner-border text-success" role="status" />
      <p className="mt-2 text-muted">Chargement du patient...</p>
    </div>
  );

  if (!patientId) return (
    <div className="container mt-5">
      <Toaster position="top-right" />
      <div className="alert alert-danger">Patient non trouvé (Numéro: {numero})</div>
      <button onClick={() => navigate(-1)} className="btn btn-secondary">Retour</button>
    </div>
  );

  return (
    <div className="container-fluid py-4">
      <Toaster position="top-right" />

      {/* Styles hover */}
      <style>{`
        .vih-hover-field:hover:not(:disabled):not([style*="cursor: default"]) {
          border-color: #86efac !important;
          box-shadow: 0 0 0 0.2rem rgba(134, 239, 172, 0.35) !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .vih-hover-field:focus {
          border-color: #16a34a !important;
          box-shadow: 0 0 0 0.2rem rgba(22, 163, 74, 0.25) !important;
        }
        input.vih-hover-field:not(:disabled):hover,
        select.vih-hover-field:not(:disabled):hover {
          border-color: #86efac !important;
          box-shadow: 0 0 0 0.2rem rgba(134, 239, 172, 0.35) !important;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
      `}</style>

      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
        <div>
          <h2 className="text-success mb-1">Fiche VIH du patient</h2>
          <p className="text-muted small mb-0">
            {currentVih ? "Fiche existante" : "Nouvelle fiche"}
          </p>
        </div>
        {isEditing && currentVih && (
          <button onClick={handleCancel} className="btn btn-outline-secondary btn-sm" disabled={isLoading}>
            <i className="bi bi-x-circle me-1"></i>Annuler
          </button>
        )}
      </div>

      {/* Formulaire — toujours visible */}
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-success text-white">
          <h5 className="mb-0">
            {!currentVih && "Nouvelle fiche VIH"}
            {currentVih && isEditing && "Modifier la fiche VIH"}
            {currentVih && !isEditing && "Consulter la fiche VIH"}
          </h5>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row g-3">

              {/* Mode de contamination — multi-select */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Mode de contamination <span className="text-danger">*</span>
                </label>
                <MultiSelectDropdown
                  options={MODES_CONTAMINATION}
                  selected={formData.mode_contamination}
                  onChange={handleModeContaminationChange}
                  disabled={isReadOnly || isLoading}
                  placeholder="-- Sélectionner (choix multiples) --"
                />
                {formData.mode_contamination.length > 0 && (
                  <div className="mt-1 d-flex flex-wrap gap-1">
                    {formData.mode_contamination.map(m => (
                      <span key={m} className="badge"
                        style={{ backgroundColor: "#dcfce7", color: "#166534", fontSize: "0.75rem", padding: "4px 8px" }}>
                        {m}
                        {!isReadOnly && (
                          <i className="bi bi-x ms-1" style={{ cursor: "pointer" }}
                            onClick={() => handleModeContaminationChange(formData.mode_contamination.filter(x => x !== m))} />
                        )}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Type de dépistage */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Type de dépistage <span className="text-danger">*</span>
                </label>
                <select name="type_depistage" className="form-select vih-hover-field"
                  value={formData.type_depistage} onChange={handleChange}
                  disabled={isReadOnly || isLoading} required>
                  <option value="">-- Sélectionner --</option>
                  {TYPES_DEPISTAGE.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Circonstance de découverte */}
              <div className="col-12">
                <label className="form-label fw-semibold">
                  Circonstance de découverte <span className="text-danger">*</span>
                </label>
                <select name="circonstance_decouverte" className="form-select vih-hover-field"
                  value={formData.circonstance_decouverte} onChange={handleChange}
                  disabled={isReadOnly || isLoading} required>
                  <option value="">-- Sélectionner --</option>
                  {CIRCONSTANCES_DECOUVERTE.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Date dernière négative */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Date dernière négative</label>
                <input type="date" name="date_derniere_negative" className="form-control vih-hover-field"
                  value={formData.date_derniere_negative} onChange={handleChange}
                  disabled={isReadOnly || isLoading} />
              </div>

              {/* Date de contamination */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Date de contamination</label>
                <input type="date" name="date_contamination" className="form-control vih-hover-field"
                  value={formData.date_contamination} onChange={handleChange}
                  disabled={isReadOnly || isLoading} />
              </div>

              {/* Date VIH positif */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Date VIH positif <span className="text-danger">*</span>
                </label>
                <input type="date" name="date_vih_positif" className="form-control vih-hover-field"
                  value={formData.date_vih_positif} onChange={handleChange}
                  disabled={isReadOnly || isLoading} required />
              </div>

              {/* Stade CDC */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Stade CDC <span className="text-danger">*</span>
                </label>
                <select name="stade_cdc" className="form-select vih-hover-field"
                  value={formData.stade_cdc} onChange={handleChange}
                  disabled={isReadOnly || isLoading} required>
                  <option value="">-- Sélectionner --</option>
                  {STADES_CDC.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Début stade C */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Début stade C</label>
                <input type="date" name="debut_stade_c" className="form-control vih-hover-field"
                  value={formData.debut_stade_c} onChange={handleChange}
                  disabled={isReadOnly || isLoading} />
              </div>

              {/* Typage HLA-B5701 */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">
                  Typage HLA-B5701 <span className="text-danger">*</span>
                </label>
                <div className="d-flex gap-3 mt-2">
                  {["Positif", "Négatif"].map(v => (
                    <div className="form-check" key={v}>
                      <input className="form-check-input" type="radio" name="typage_hla_b5701"
                        value={v} checked={formData.typage_hla_b5701 === v}
                        onChange={handleChange} disabled={isReadOnly || isLoading} />
                      <label className="form-check-label">{v}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Profil de séroconversion */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Profil de séroconversion (Fiebig I à V)</label>
                <div className="d-flex gap-3 mt-2">
                  {[["Oui", true], ["Non", false]].map(([lbl, val]) => (
                    <div className="form-check" key={lbl}>
                      <input className="form-check-input" type="radio"
                        checked={formData.profil_seroconversion === val}
                        onChange={() => !isReadOnly && !isLoading && setFormData(p => ({ ...p, profil_seroconversion: val }))}
                        disabled={isReadOnly || isLoading}
                        readOnly />
                      <label className="form-check-label">{lbl}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="col-12 mt-3">
                {/* Cas : données existantes en lecture seule → bouton Modifier */}
                {isReadOnly && (
                  <button type="button" className="btn btn-outline-success w-100 py-2" onClick={handleEdit}>
                    <i className="bi bi-pencil-square me-2"></i>Modifier la fiche VIH
                  </button>
                )}

                {/* Cas : édition ou nouveau patient → bouton Enregistrer */}
                {!isReadOnly && (
                  <button type="submit" className="btn btn-success w-100 py-2" disabled={isLoading}>
                    {isLoading
                      ? <><span className="spinner-border spinner-border-sm me-2" />Enregistrement...</>
                      : <><i className="bi bi-save me-2" />
                        {currentVih ? "Enregistrer les modifications" : "Enregistrer la fiche VIH"}</>
                    }
                  </button>
                )}
              </div>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}