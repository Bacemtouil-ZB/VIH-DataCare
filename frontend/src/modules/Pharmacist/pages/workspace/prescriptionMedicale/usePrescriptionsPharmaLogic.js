import { useEffect, useMemo, useState } from "react";
import {
  getPatientsWithPrescriptions,
  getNextRendezVousPerPatient,
} from "../../../services/patientPrescriptionService";
import {
  deleteExpiredPrescriptions,
  validatePrescription,
  validatePrescriptionAvecModification,
} from "../../../../../shared/services/prescriptionWorkflowService";
import { toUiPrescriptionItem, MESSAGES } from "./prescriptionsPharmaConstants";
import { filterPrescriptions } from "./PrescriptionsPharmahelpers";
import {
  confirmAction,
  alertSuccess,
  alertError,
} from "../../../../../shared/utils/uiAlerts.js";

export function usePrescriptionsLogic() {
  const [patients, setPatients]               = useState([]);
  const [search, setSearch]                   = useState("");
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [showHistory, setShowHistory]         = useState(true);
  const [detailItem, setDetailItem]           = useState(null);
  const [validationItem, setValidationItem]   = useState(null);
  const [modificationItem, setModificationItem] = useState(null);
  const [savingValidation, setSavingValidation] = useState(false);

  // ── Chargement ───────────────────────────────────────────────
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        await deleteExpiredPrescriptions();
      } catch (cleanupError) {
        console.warn("Nettoyage prescriptions expirées non exécuté :", cleanupError);
      }

      const [data, rdvMap] = await Promise.all([
        getPatientsWithPrescriptions(),
        getNextRendezVousPerPatient(),
      ]);

      const rows = Array.isArray(data?.patients) ? data.patients : [];
      setPatients(
        rows.map((row) => {
          const rdv = rdvMap?.[row.patient_id] ?? null;
          return toUiPrescriptionItem({
            ...row,
            rdv_date:   rdv?.date   ?? null,
            rdv_heure:  rdv?.heure  ?? null,
            rdv_type:   rdv?.type   ?? null,
            rdv_statut: rdv?.statut ?? null,
          });
        })
      );
    } catch (err) {
      setError(err?.message || MESSAGES.erreurChargement);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  const filtered = useMemo(
    () => filterPrescriptions(patients, search),
    [patients, search]
  );

  // ── Détail ───────────────────────────────────────────────────
  const openDetail  = (item) => setDetailItem(item);
  const closeDetail = ()     => setDetailItem(null);

  // ── Validation ───────────────────────────────────────────────
  const openValidation  = (item) => setValidationItem(item);
  const closeValidation = ()     => { if (!savingValidation) setValidationItem(null); };

  // ── Modification ─────────────────────────────────────────────
  const openModification  = (item) => setModificationItem(item);
  const closeModification = ()     => { if (!savingValidation) setModificationItem(null); };

  // ── Validation SANS modification (Scénario 1) ─────────────────
  const handleValidate = async () => {
    if (!validationItem?.prescriptionId) return;

    const confirmed = await confirmAction({
      title:        "Valider la prescription ?",
      message:      "Le traitement sera délivré au patient.",
      confirmLabel: "Valider",
      cancelLabel:  "Annuler",
    });
    if (!confirmed) return;

    setSavingValidation(true);
    try {
      const result = await validatePrescription(validationItem.prescriptionId);

      // Alerte contradiction → patient administratif + délivrance
      if (result?.alerte) {
        await confirmAction({
          title:        "⚠️ Incohérence détectée",
          message:      "Ce patient est marqué comme décédé ou transféré. Veuillez vérifier avec le médecin.",
          confirmLabel: "Compris",
          cancelLabel:  "Fermer",
        });
      } else {
        await alertSuccess("Prescription validée avec succès");
      }

      setValidationItem(null);
      await loadPatients();
    } catch (err) {
      await alertError(err?.message || MESSAGES.erreurValidation);
    } finally {
      setSavingValidation(false);
    }
  };

  // ── Validation AVEC modification (Scénario 2) ─────────────────
  const handleValidateAvecModification = async (periodeModifiee) => {
    if (!modificationItem?.prescriptionId) return;

    const confirmed = await confirmAction({
      title:        "Valider avec modification ?",
      message:      `La période sera modifiée à ${periodeModifiee} jours.`,
      confirmLabel: "Valider",
      cancelLabel:  "Annuler",
    });
    if (!confirmed) return;

    setSavingValidation(true);
    try {
      const result = await validatePrescriptionAvecModification(
        modificationItem.prescriptionId,
        periodeModifiee,
      );

      if (result?.alerte) {
        await confirmAction({
          title:        "⚠️ Incohérence détectée",
          message:      "Ce patient est marqué comme décédé ou transféré. Veuillez vérifier avec le médecin.",
          confirmLabel: "Compris",
          cancelLabel:  "Fermer",
        });
      } else {
        await alertSuccess("Prescription modifiée et validée avec succès");
      }

      setModificationItem(null);
      await loadPatients();
    } catch (err) {
      await alertError(err?.message || MESSAGES.erreurValidation);
    } finally {
      setSavingValidation(false);
    }
  };

  return {
    search,
    showHistory,
    loading,
    error,
    filtered,
    detailItem,
    validationItem,
    modificationItem,
    savingValidation,
    setSearch,
    setShowHistory,
    loadPatients,
    openDetail,
    closeDetail,
    openValidation,
    closeValidation,
    openModification,
    closeModification,
    handleValidate,
    handleValidateAvecModification,
  };
}