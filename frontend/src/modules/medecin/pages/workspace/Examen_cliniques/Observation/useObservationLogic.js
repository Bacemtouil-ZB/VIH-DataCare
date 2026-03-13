import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../../shared/utils/uiAlerts";
import {
  createObservation,
  getObservationsByPatient,
  updateObservation,
} from "../../../../services/examenCliniqueServices/observationService";
import { formatDateFr, handleCancelForm, openFormForCreate, showDetailMode } from "../../../../../../shared/utils/logiqueTableHistory";

export function useObservationLogic(patientNumero, examenId) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);

  const [observationId, setObservationId] = useState(null);
  const [isModifying, setIsModifying] = useState(false);
  const [remarque, setRemarque] = useState("");

  const [historique, setHistorique] = useState([]);
  const [detailObservation, setDetailObservation] = useState(null);

  const resetForm = () => {
    setObservationId(null);
    setIsModifying(false);
    setRemarque("");
  };

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

  const handleCancel = () => {
    handleCancelForm(setShowForm, resetForm, toast);
  };

  const openCreate = () => openFormForCreate(setDetailObservation, resetForm, setShowForm);

  const handleEdit = async (obs) => {
    const ok = await confirmAction(
      "Modifier cette observation ?",
      `Date : ${formatDateFr(obs.date_examen)} - ${obs.remarque?.slice(0, 60)}${obs.remarque?.length > 60 ? "..." : ""}`
    );
    if (!ok) return;
    setDetailObservation(null);
    setObservationId(obs.id);
    setIsModifying(true);
    setRemarque(obs.remarque || "");
    setShowForm(true);
    toast.info("Mode modification actif");
  };

  const handleShowDetails = (obs) => {
    showDetailMode(setShowForm, setDetailObservation, obs);
  };

  const handleSave = async () => {
    if (!remarque.trim()) return toast.error("Veuillez saisir une remarque");
    if (!await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer cette observation ?",
      "Les données seront enregistrées dans le dossier patient."
    )) return;

    setSaving(true);
    try {
      if (isModifying && observationId) {
        await updateObservation(observationId, { remarque: remarque.trim() });
        setHistorique((prev) => prev.map((o) => (o.id === observationId ? { ...o, remarque: remarque.trim() } : o)));
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
      await alertError(e?.message || "Erreur lors de l'enregistrement");
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

