import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import {
  createObservation,
  getObservationsByPatient,
  updateObservation,
} from "../../../../services/examenCliniqueServices/observationService";
import {
  handleCancelForm,
  openFormForCreate,
  showDetailMode,
} from "../../../../../../shared/utils/logiqueTableHistory";
import { clearFieldError } from "../../../../shared/utils/clearFieldError";

export function useObservationLogic(patientNumero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [errors, setErrors] = useState({});                // ← erreurs par champ

  const [observationId, setObservationId] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [remarque, setRemarque] = useState("");

  const [historique, setHistorique] = useState([]);
  const [detailObservation, setDetailObservation] = useState(null);

  // ====== Reset formulaire ======
  const resetForm = () => {
    setObservationId(null);
    setIsModifying(false);
    setRemarque("");
    setErrors({});                                         // ← efface les erreurs
  };

  // ====== Chargement initial ======
  useEffect(() => {
    if (!patientNumero) return;
    (async () => {
      setLoading(true);
      try {
        const res = await getObservationsByPatient(patientNumero);
        setHistorique(res?.observations || []);
      } catch {
        setHistorique([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [patientNumero]);

  // ====== handleRemarqueChange ======
  // Efface l'erreur du champ dès que l'utilisateur tape
  const handleRemarqueChange = (e) => {
    setRemarque(e.target.value);
    clearFieldError("remarque", setErrors);
  };

  // ====== Cancel ======
  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
    // resetForm inclut setErrors({})
  };

  // ====== Ouvrir en mode création ======
  const openCreate = () => {
    openFormForCreate(setDetailObservation, resetForm, setShowForm);
    // resetForm inclut setErrors({})
  };

  // ====== Ouvrir en mode modification ======
  const handleEdit = async (obs) => {
    setDetailObservation(null);
    setObservationId(obs.id);
    setIsModifying(true);
    setRemarque(obs.remarque || "");
    setShowForm(true);
    setErrors({});                                         // ← reset à l'ouverture
    toast.info("Mode modification actif");
  };

  const handleShowDetails = (obs) => {
    showDetailMode(setShowForm, setDetailObservation, obs);
  };

  // ====== Soumission ======
  const handleSave = async () => {

    // ── Validation frontend ──────────────────────────────────────────────────
    // → FieldError sous le textarea, pas de toast pour les erreurs de champ
    if (!remarque.trim()) {
      setErrors({ remarque: "Veuillez saisir une remarque" });
      return;
    }
    if (remarque.trim().length < 5) {
      setErrors({ remarque: "La remarque doit contenir au moins 5 caractères" });
      return;
    }

    if (!await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer cette observation ?",
      "Les données seront enregistrées dans le dossier patient.",
    )) return;

    setSaving(true);
    setErrors({});

    try {
      if (isModifying && observationId) {
        await updateObservation(observationId, { remarque: remarque.trim() });
        setHistorique((prev) =>
          prev.map((o) => (o.id === observationId ? { ...o, remarque: remarque.trim() } : o)),
        );
        toast.success("Observation mise à jour");
      } else {
        await createObservation({ examen_clinique_id: examenId, remarque: remarque.trim() });
        const res = await getObservationsByPatient(patientNumero);
        setHistorique(res?.observations || []);
        toast.success("Observation enregistrée");
      }
      setShowForm(false);
      resetForm();

    } catch (e) {

      // Cas 1 — errors[] avec field (express-validator via handleValidation)
      // → FieldError affiché sous le textarea
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
        return;
      }

      // Cas 2 — message simple (erreur métier serveur)
      // → FieldError sous remarque (seul champ du formulaire)
      if (e?.message) {
        setErrors({ remarque: e.message });
        return;
      }

      // Cas 3 — fallback inattendu (réseau, serveur indisponible)
      alertError("Erreur lors de l'enregistrement");

    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    showForm,
    setShowForm,
    showHistory,
    setShowHistory,
    isModifying,
    observationId,
    remarque,
    setRemarque,
    handleRemarqueChange,                                  // ← wrapper avec clearFieldError
    errors,                                                // ← exposé pour <FieldError />
    historique,
    detailObservation,
    setDetailObservation,
    openCreate,
    handleCancel,
    handleEdit,
    handleShowDetails,
    handleSave,
  };
}