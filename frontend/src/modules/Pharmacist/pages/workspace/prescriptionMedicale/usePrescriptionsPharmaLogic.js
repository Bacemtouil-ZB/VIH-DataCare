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
import { toast } from "react-toastify";

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

  const openDetail  = (item) => setDetailItem(item);
  const closeDetail = ()     => setDetailItem(null);

  const openValidation  = (item) => setValidationItem(item);
  const closeValidation = ()     => { if (!savingValidation) setValidationItem(null); };

  const openModification  = (item) => setModificationItem(item);
  const closeModification = ()     => { if (!savingValidation) setModificationItem(null); };

  const handleValidate = async () => {
    if (!validationItem?.prescriptionId) return;

    setSavingValidation(true);
    try {
      const result = await validatePrescription(validationItem.prescriptionId);

      // Alerte contradiction → patient administratif + délivrance
      if (result?.alerte) {
        toast.warn("Ce patient est marqué comme décédé ou transféré. Veuillez vérifier avec le médecin.");
      } else {
        toast.success("Prescription validée avec succès");
      }

      setValidationItem(null);
      await loadPatients();
    } catch (err) {
      toast.error(err?.message || MESSAGES.erreurValidation);
    } finally {
      setSavingValidation(false);
    }
  };

  const handleValidateAvecModification = async (periodeModifiee) => {
    if (!modificationItem?.prescriptionId) return;
    setSavingValidation(true);
    try {
      const result = await validatePrescriptionAvecModification(
        modificationItem.prescriptionId,
        periodeModifiee,
      );

      if (result?.alerte) {
        toast.warn("Ce patient est marqué comme décédé ou transféré. Veuillez vérifier avec le médecin.");
      } else {
        toast.success("Prescription modifiée et validée avec succès");
      }

      setModificationItem(null);
      await loadPatients();
    } catch (err) {
      toast.error(err?.message || MESSAGES.erreurValidation);
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