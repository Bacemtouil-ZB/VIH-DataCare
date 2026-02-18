import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
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
  mode_contamination: "",
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

// ─── Composant ───────────────────────────────────────────────────────────────
export default function VihPage() {
  const { numero } = useParams();
  const navigate = useNavigate();

  // États
  const [patientId, setPatientId] = useState(null);
  const [currentVih, setCurrentVih] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [mode, setMode] = useState("create");
  const [showForm, setShowForm] = useState(false);
  const [existingDebutStadeC, setExistingDebutStadeC] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  // ─── Chargement patient ──────────────────────────────────────────────────────
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

  // ─── Chargement données VIH ──────────────────────────────────────────────────
  useEffect(() => {
    if (patientId) loadVihData();
  }, [patientId]);

  const loadVihData = async () => {
    try {
      const history = await vihService.getVihHistory(patientId);
      
      const debutStadeC = vihService.getFirstDebutStadeC(history);
      setExistingDebutStadeC(debutStadeC);

      if (history.length > 0) {
        setCurrentVih(history[0]);
        setMode("view");
      } else {
        setCurrentVih(null);
        setMode("create");
      }
      setShowForm(false);
    } catch (err) {
      console.error("Erreur chargement données VIH:", err);
      toast.error("Erreur lors du chargement des données");
    }
  };

  // ─── Sync formulaire ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentVih) {
      setFormData({
        mode_contamination: currentVih.mode_contamination || "",
        type_depistage: currentVih.type_depistage || "",
        circonstance_decouverte: currentVih.circonstance_decouverte || "",
        date_derniere_negative: vihService.formatDateForInput(currentVih.date_derniere_negative),
        date_contamination: vihService.formatDateForInput(currentVih.date_contamination),
        date_vih_positif: vihService.formatDateForInput(currentVih.date_vih_positif),
        stade_cdc: currentVih.stade_cdc || "",
        debut_stade_c: vihService.formatDateForInput(currentVih.debut_stade_c),
        typage_hla_b5701: currentVih.typage_hla_b5701 || "",
        profil_seroconversion: currentVih.profil_seroconversion || false,
      });
    } else if (mode === "create") {
      setFormData({
        ...EMPTY_FORM,
        debut_stade_c: existingDebutStadeC ? vihService.formatDateForInput(existingDebutStadeC) : "",
      });
    }
  }, [currentVih, mode, existingDebutStadeC]);

  // ─── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(p => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Enregistrement en cours...");
    
    try {
      setIsLoading(true);

      if (mode === "edit") {
        await vihService.updateVih(currentVih.id, formData);
        toast.success("Fiche VIH mise à jour", { id: tid });
      } else {
        await vihService.createVih({ ...formData, patient_id: patientId });
        toast.success("Fiche VIH créée avec succès", { id: tid });
      }

      await loadVihData();
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (err) {
      const errs = err.response?.data?.errors;
      if (Array.isArray(errs)) {
        toast.error("Erreurs de validation", { id: tid });
        errs.forEach((e, i) => setTimeout(() =>
          toast.error(`${vihService.getFieldLabel(e.field)}: ${e.message}`, { duration: 5000 }), i * 120));
      } else {
        toast.error(err.response?.data?.message || "Une erreur s'est produite", { id: tid });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setCurrentVih(null);
    setMode("create");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 300, behavior: "smooth" }), 100);
    toast.success("Nouvelle fiche VIH");
  };

  const handleEdit = () => {
    setMode("edit");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 300, behavior: "smooth" }), 100);
    toast.success("Mode édition activé");
  };

  const handleCancel = () => {
    if (currentVih) {
      setMode("view");
      setShowForm(false);
    } else {
      setCurrentVih(null);
      setMode("create");
      setShowForm(false);
    }
    toast.success("Modifications annulées");
  };

  const isReadOnly = mode === "view";
  const debutDisabled = isReadOnly || (mode === "create" && !!existingDebutStadeC);

  // ─── Rendu ───────────────────────────────────────────────────────────────────
  if (isLoadingPatient) return (
    <div className="container mt-5 text-center">
      <Toaster position="top-right" />
      <div className="spinner-border text-success" />
      <p className="mt-3 text-muted">Chargement du patient...</p>
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

      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
        <div>
          <h2 className="text-success mb-1">Fiche VIH du patient</h2>
          <p className="text-muted small mb-0">
            {currentVih ? "Fiche existante" : "Nouvelle fiche"}
          </p>
        </div>

        <div className="d-flex gap-2">
          {showForm && mode === "view" && currentVih && (
            <button onClick={handleEdit} className="btn btn-outline-primary btn-sm">
              <i className="bi bi-pencil me-1"></i>Modifier
            </button>
          )}

          {!(showForm && mode === "create") && !currentVih && (
            <button onClick={handleAddNew} className="btn btn-success btn-sm">
              <i className="bi bi-plus-circle me-1"></i>Ajouter nouvelle fiche
            </button>
          )}

          {showForm && (mode === "edit" || mode === "create") && (
            <button onClick={handleCancel} className="btn btn-outline-secondary btn-sm" disabled={isLoading}>
              <i className="bi bi-x-circle me-1"></i>Annuler
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {!showForm && !currentVih && (
        <div className="alert alert-info border-0" style={{backgroundColor:"#f0f9ff", color:"#0369a1"}}>
          Aucune fiche VIH trouvée. Cliquez sur <strong>"Ajouter nouvelle fiche"</strong>.
        </div>
      )}
      {!showForm && currentVih && (
        <div className="alert alert-secondary border-0">
          <i className="bi bi-eye me-2"></i>
          Une fiche VIH existe déjà pour ce patient. Cliquez sur <strong>"Modifier"</strong> pour la mettre à jour.
        </div>
      )}

      {/* Formulaire */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">
              {mode === "create" && "Nouvelle fiche VIH"}
              {mode === "edit" && "Modifier la fiche VIH"}
              {mode === "view" && "Consulter la fiche VIH"}
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label">Mode de contamination <span className="text-danger">*</span></label>
                  <select name="mode_contamination" className="form-select" value={formData.mode_contamination}
                    onChange={handleChange} disabled={isReadOnly || isLoading} required>
                    <option value="">-- Sélectionner --</option>
                    {MODES_CONTAMINATION.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Type de dépistage <span className="text-danger">*</span></label>
                  <select name="type_depistage" className="form-select" value={formData.type_depistage}
                    onChange={handleChange} disabled={isReadOnly || isLoading} required>
                    <option value="">-- Sélectionner --</option>
                    {TYPES_DEPISTAGE.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label">Circonstance de découverte <span className="text-danger">*</span></label>
                  <select name="circonstance_decouverte" className="form-select" value={formData.circonstance_decouverte}
                    onChange={handleChange} disabled={isReadOnly || isLoading} required>
                    <option value="">-- Sélectionner --</option>
                    {CIRCONSTANCES_DECOUVERTE.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date dernière négative</label>
                  <input type="date" name="date_derniere_negative" className="form-control"
                    value={formData.date_derniere_negative} onChange={handleChange} disabled={isReadOnly || isLoading} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date de contamination</label>
                  <input type="date" name="date_contamination" className="form-control"
                    value={formData.date_contamination} onChange={handleChange} disabled={isReadOnly || isLoading} />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Date VIH positif <span className="text-danger">*</span></label>
                  <input type="date" name="date_vih_positif" className="form-control"
                    value={formData.date_vih_positif} onChange={handleChange} disabled={isReadOnly || isLoading} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Stade CDC <span className="text-danger">*</span></label>
                  <select name="stade_cdc" className="form-select" value={formData.stade_cdc}
                    onChange={handleChange} disabled={isReadOnly || isLoading} required>
                    <option value="">-- Sélectionner --</option>
                    {STADES_CDC.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">
                    Début stade C
                    {debutDisabled && mode === "create" && existingDebutStadeC &&
                      <small className="text-muted ms-2">(déjà enregistré)</small>}
                  </label>
                  <input type="date" name="debut_stade_c" className="form-control"
                    value={formData.debut_stade_c} onChange={handleChange} disabled={debutDisabled || isLoading} />
                  {debutDisabled && mode === "create" && existingDebutStadeC && (
                    <small className="text-muted">
                      Enregistré le {new Date(existingDebutStadeC).toLocaleDateString("fr-FR")}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label">Typage HLA-B5701 <span className="text-danger">*</span></label>
                  <div className="d-flex gap-3 mt-2">
                    {["Positif","Négatif"].map(v => (
                      <div className="form-check" key={v}>
                        <input className="form-check-input" type="radio" name="typage_hla_b5701"
                          value={v} checked={formData.typage_hla_b5701 === v}
                          onChange={handleChange} disabled={isReadOnly || isLoading} />
                        <label className="form-check-label">{v}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Profil de séroconversion (Fiebig I à V)</label>
                  <div className="d-flex gap-3 mt-2">
                    {[["Oui", true],["Non", false]].map(([lbl, val]) => (
                      <div className="form-check" key={lbl}>
                        <input className="form-check-input" type="radio"
                          checked={formData.profil_seroconversion === val}
                          onChange={() => setFormData(p => ({ ...p, profil_seroconversion: val }))}
                          disabled={isReadOnly || isLoading} />
                        <label className="form-check-label">{lbl}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="col-12 mt-2">
                    <button type="submit" className="btn btn-success w-100 py-2" disabled={isLoading}>
                      {isLoading
                        ? <><span className="spinner-border spinner-border-sm me-2"/>Enregistrement...</>
                        : <><i className="bi bi-save me-2"/>
                          {mode === "create" ? "Enregistrer la fiche VIH" : "Enregistrer les modifications"}</>
                      }
                    </button>
                  </div>
                )}

              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}