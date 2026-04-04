// =====================================================
// LOGIC - usePrescriptionsPharmaLogic.js (UPDATED)
// =====================================================

import { useEffect, useMemo, useState } from "react";
import {
  getPatientsWithPrescriptions,
  getNextRendezVousPerPatient,
} from "../../../services/patientPrescriptionService";
import {
  validatePrescription,
  validatePrescriptionAvecModification,
} from "../../../../../shared/services/prescriptionWorkflowService";
import { toUiPrescriptionItem, MESSAGES } from "./prescriptionsPharmaConstants";
import { filterPrescriptions } from "./PrescriptionsPharmahelpers";

export function usePrescriptionsLogic() {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [validationItem, setValidationItem] = useState(null);
  const [modificationItem, setModificationItem] = useState(null); // ← NOUVEAU
  const [savingValidation, setSavingValidation] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);

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
            rdv_date: rdv?.date ?? null,
            rdv_heure: rdv?.heure ?? null,
            rdv_type: rdv?.type ?? null,
            rdv_statut: rdv?.statut ?? null,
          });
        }),
      );
    } catch (err) {
      setError(err?.message || err?.error || MESSAGES.erreurChargement);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filtered = useMemo(
    () => filterPrescriptions(patients, search),
    [patients, search],
  );

  const openDetail = (item) => setDetailItem(item);
  const closeDetail = () => setDetailItem(null);

  const openValidation = (item) => setValidationItem(item);
  const closeValidation = () => {
    if (!savingValidation) setValidationItem(null);
  };

  // ── NOUVEAU : Gestion modification ────────────────────────────
  const openModification = (item) => setModificationItem(item);
  const closeModification = () => {
    if (!savingValidation) setModificationItem(null);
  };

  // ── Validation SANS modification (Scénario 1) ─────────────────
  const handleValidate = async () => {
    if (!validationItem?.prescriptionId) return;
    setSavingValidation(true);
    try {
      await validatePrescription(validationItem.prescriptionId);
      setValidationItem(null);
      await loadPatients();
    } catch (err) {
      alert(err?.message || err?.error || MESSAGES.erreurValidation);
    } finally {
      setSavingValidation(false);
    }
  };

  // ── Validation AVEC modification (Scénario 2) ─────────────────
  const handleValidateAvecModification = async (periodeModifiee) => {
    if (!modificationItem?.prescriptionId) return;
    setSavingValidation(true);
    try {
      await validatePrescriptionAvecModification(
        modificationItem.prescriptionId,
        periodeModifiee,
      );
      setModificationItem(null);
      await loadPatients();
    } catch (err) {
      alert(err?.message || err?.error || MESSAGES.erreurValidation);
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
    modificationItem, // ← NOUVEAU
    savingValidation,
    setSearch,
    setShowHistory,
    loadPatients,
    openDetail,
    closeDetail,
    openValidation,
    closeValidation,
    openModification, // ← NOUVEAU
    closeModification, // ← NOUVEAU
    handleValidate,
    handleValidateAvecModification, // ← NOUVEAU
  };
}