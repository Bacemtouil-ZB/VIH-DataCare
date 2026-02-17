import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';
import API from "../../../../../shared/utils/api";
import VihHistory from "../../../components/layout/vihhistory";

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
  "A0", "A1", "A2", "A3",
  "B0", "B1", "B2", "B3",
  "C0", "C1", "C2", "C3"
];

export default function VihPage() {
  const { numero } = useParams();
  const navigate = useNavigate();

  const [patientId, setPatientId] = useState(null);
  const [currentVih, setCurrentVih] = useState(null);
  const [vihHistory, setVihHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [mode, setMode] = useState("view");
  const [showForm, setShowForm] = useState(false);
  const [existingDebutStadeC, setExistingDebutStadeC] = useState(null);

  const [formData, setFormData] = useState({
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
  });

  const formatDateForInput = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    return date.toISOString().split('T')[0];
  };

  useEffect(() => {
    if (numero) {
      fetchPatientId();
    }
  }, [numero]);

  useEffect(() => {
    if (patientId) {
      fetchVihHistory();
    }
  }, [patientId]);

  useEffect(() => {
    if (currentVih) {
      setFormData({
        mode_contamination: currentVih.mode_contamination || "",
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
    } else if (mode === "create" && existingDebutStadeC) {
      setFormData(prev => ({
        ...prev,
        debut_stade_c: formatDateForInput(existingDebutStadeC)
      }));
    } else if (mode === "create") {
      setFormData({
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
      });
    }
  }, [currentVih, mode, existingDebutStadeC]);

  const fetchPatientId = async () => {
    try {
      setIsLoadingPatient(true);
      const response = await API.get(`/patients/numero/${numero}`);
      
      if (response.data && response.data.patient) {
        setPatientId(response.data.patient.id);
      } else {
        toast.error(" Patient non trouvé");
      }
    } catch (error) {
      console.error(" Erreur récupération patient:", error);
      toast.error(" Impossible de récupérer les informations du patient");
    } finally {
      setIsLoadingPatient(false);
    }
  };

  const fetchVihHistory = async () => {
    try {
      const response = await API.get(`/vih/history/${patientId}`);
      
      if (response.data && response.data.history) {
        const history = response.data.history;
        setVihHistory(history);
        
        const firstWithDebutStadeC = history
          .slice()
          .reverse()
          .find(vih => vih.debut_stade_c);
        
        setExistingDebutStadeC(firstWithDebutStadeC?.debut_stade_c || null);
        
        if (history.length > 0) {
          setCurrentVih(history[0]);
          setMode("view");
          setShowForm(false);
        } else {
          setCurrentVih(null);
          setMode("create");
          setShowForm(false);
        }
      }
      
    } catch (error) {
      if (error.response?.status === 404) {
        setVihHistory([]);
        setCurrentVih(null);
        setMode("create");
        setShowForm(false);
      } else {
        console.error("Erreur:", error);
        toast.error("Erreur lors du chargement de l'historique");
      }
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading(" Enregistrement en cours...");
    
    try {
      setIsLoading(true);

      if (mode === "edit") {
        await API.put(`/vih/update/${currentVih.id}`, formData);
        toast.success(" Fiche VIH mise à jour avec succès", { id: toastId });
      } else if (mode === "create") {
        await API.post("/vih/add", {
          ...formData,
          patient_id: patientId
        });
        toast.success(" Nouvelle fiche VIH créée avec succès", { id: toastId });
      }

      await fetchVihHistory();
      setMode("view");
      setShowForm(false);
      window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
      console.error(" Erreur soumission:", error);

      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        toast.error(" Erreurs de validation", { id: toastId });
        
        error.response.data.errors.forEach((err, index) => {
          setTimeout(() => {
            const fieldName = getFieldLabel(err.field);
            toast.error(`⚠️ ${fieldName}: ${err.message}`, {
              duration: 5000
            });
          }, index * 100);
        });
      } else {
        const message = error.response?.data?.message || "Une erreur s'est produite";
        toast.error(` ${message}`, { id: toastId });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldLabel = (field) => {
    const labels = {
      mode_contamination: "Mode de contamination",
      type_depistage: "Type de dépistage",
      circonstance_decouverte: "Circonstance de découverte",
      date_derniere_negative: "Date dernière négative",
      date_contamination: "Date de contamination",
      date_vih_positif: "Date VIH positif",
      stade_cdc: "Stade CDC",
      debut_stade_c: "Début stade C",
      typage_hla_b5701: "Typage HLA-B5701",
      profil_seroconversion: "Profil de séroconversion"
    };
    return labels[field] || field;
  };

  const handleEdit = () => {
    setMode("edit");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 300, behavior: "smooth" }), 100);
    toast.success("Mode édition activé");
  };

  const handleAddNew = () => {
    setCurrentVih(null);
    setMode("create");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 300, behavior: "smooth" }), 100);
    toast.success("Nouvelle fiche VIH");
  };

  const handleCancel = () => {
    if (vihHistory.length > 0) {
      setCurrentVih(vihHistory[0]);
      setMode("view");
    } else {
      setCurrentVih(null);
      setMode("create");
    }
    setShowForm(false);
    toast.info(" Modifications annulées");
  };

  const handleLoadVih = (vih) => {
    setCurrentVih(vih);
    setMode("view");
    setShowForm(true);
    setTimeout(() => window.scrollTo({ top: 300, behavior: "smooth" }), 100);
    toast.success("Fiche chargée");
  };

  const isReadOnly = mode === "view";
  const isDebutStadeCDisabled = isReadOnly || (vihHistory.length > 0 && existingDebutStadeC && mode === "create");

  if (isLoadingPatient) {
    return (
      <div className="container mt-5">
        <Toaster position="top-right" />
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3">Chargement du patient...</p>
        </div>
      </div>
    );
  }

  if (!patientId) {
    return (
      <div className="container mt-5">
        <Toaster position="top-right" />
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Patient non trouvé (Numéro: {numero})
        </div>
        <button onClick={() => navigate(-1)} className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>Retour
        </button>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <Toaster position="top-right" />
      
      {/* En-tête */}
      <div className="d-flex justify-content-between align-items-start mb-4 pb-3 border-bottom">
        <div>
          <h2 className="text-success mb-1">Fiche VIH du patient</h2>
          <p className="text-muted small mb-0">
            {vihHistory.length > 0 ? `${vihHistory.length} fiche(s) enregistrée(s)` : "Aucune fiche"}
          </p>
        </div>
        
        <div className="d-flex gap-2">
          {showForm && mode === "view" && currentVih && (
            <button onClick={handleEdit} className="btn btn-primary">
              <i className="bi bi-pencil me-2"></i>Modifier
            </button>
          )}

          {mode !== "create" && (
            <button onClick={handleAddNew} className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>Ajouter nouvelle fiche
            </button>
          )}

          {showForm && (mode === "edit" || mode === "create") && (
            <button onClick={handleCancel} className="btn btn-secondary" disabled={isLoading}>
              <i className="bi bi-x-circle me-2"></i>Annuler
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {!showForm && vihHistory.length === 0 && (
        <div className="alert alert-info" role="alert">
          <i className="bi bi-info-circle me-2"></i>
          Aucune fiche VIH trouvée pour ce patient. Cliquez sur <strong>"Ajouter nouvelle fiche"</strong> pour créer la première fiche.
        </div>
      )}
      {/* ✅ FORMULAIRE INTÉGRÉ */}
      {showForm && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Mode de contamination <span className="text-danger">*</span>
                  </label>
                  <select
                    name="mode_contamination"
                    className="form-select"
                    value={formData.mode_contamination}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {MODES_CONTAMINATION.map(mode => (
                      <option key={mode} value={mode}>{mode}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Type de dépistage <span className="text-danger">*</span>
                  </label>
                  <select
                    name="type_depistage"
                    className="form-select"
                    value={formData.type_depistage}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {TYPES_DEPISTAGE.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12">
                  <label className="form-label fw-semibold">
                    Circonstance de découverte <span className="text-danger">*</span>
                  </label>
                  <select
                    name="circonstance_decouverte"
                    className="form-select"
                    value={formData.circonstance_decouverte}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {CIRCONSTANCES_DECOUVERTE.map(circonstance => (
                      <option key={circonstance} value={circonstance}>{circonstance}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date dernière négative</label>
                  <input
                    type="date"
                    name="date_derniere_negative"
                    className="form-control"
                    value={formData.date_derniere_negative}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Date de contamination</label>
                  <input
                    type="date"
                    name="date_contamination"
                    className="form-control"
                    value={formData.date_contamination}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Date VIH positif <span className="text-danger">*</span>
                  </label>
                  <input
                    type="date"
                    name="date_vih_positif"
                    className="form-control"
                    value={formData.date_vih_positif}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Stade CDC <span className="text-danger">*</span>
                  </label>
                  <select
                    name="stade_cdc"
                    className="form-select"
                    value={formData.stade_cdc}
                    onChange={handleFormChange}
                    disabled={isReadOnly || isLoading}
                    required
                  >
                    <option value="">-- Sélectionner --</option>
                    {STADES_CDC.map(stade => (
                      <option key={stade} value={stade}>{stade}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Début stade C
                    {existingDebutStadeC && vihHistory.length > 0 && mode === "create" && (
                      <small className="text-muted ms-2">(Déjà enregistré)</small>
                    )}
                  </label>
                  <input
                    type="date"
                    name="debut_stade_c"
                    className="form-control"
                    value={formData.debut_stade_c}
                    onChange={handleFormChange}
                    disabled={isDebutStadeCDisabled || isLoading}
                  />
                  {existingDebutStadeC && vihHistory.length > 0 && mode === "create" && (
                    <small className="text-muted">
                      <i className="bi bi-pin-angle-fill me-1"></i>
                      Date enregistrée le {new Date(existingDebutStadeC).toLocaleDateString("fr-FR")}
                    </small>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Typage HLA-B5701 <span className="text-danger">*</span>
                  </label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="typage_hla_b5701"
                        value="Positif"
                        checked={formData.typage_hla_b5701 === "Positif"}
                        onChange={handleFormChange}
                        disabled={isReadOnly || isLoading}
                      />
                      <label className="form-check-label">Positif</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="typage_hla_b5701"
                        value="Négatif"
                        checked={formData.typage_hla_b5701 === "Négatif"}
                        onChange={handleFormChange}
                        disabled={isReadOnly || isLoading}
                      />
                      <label className="form-check-label">Négatif</label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Profil de séroconversion (Fiebig I à V)</label>
                  <div className="d-flex gap-3 mt-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="profil_seroconversion"
                        checked={formData.profil_seroconversion === true}
                        onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: true }))}
                        disabled={isReadOnly || isLoading}
                      />
                      <label className="form-check-label">Oui</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="profil_seroconversion"
                        checked={formData.profil_seroconversion === false}
                        onChange={() => setFormData(prev => ({ ...prev, profil_seroconversion: false }))}
                        disabled={isReadOnly || isLoading}
                      />
                      <label className="form-check-label">Non</label>
                    </div>
                  </div>
                </div>

                {!isReadOnly && (
                  <div className="col-12 mt-4">
                    <button 
                      type="submit" 
                      className="btn btn-success w-100 py-2"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          {mode === "create" ? "Enregistrer la fiche VIH" : "Enregistrer les modifications"}
                        </>
                      )}
                    </button>
                  </div>
                )}

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Historique */}
      {vihHistory.length > 0 && (
        <VihHistory 
          history={vihHistory}
          currentVihId={currentVih?.id}
          onLoadVih={handleLoadVih}
        />
      )}
    </div>
  );
}