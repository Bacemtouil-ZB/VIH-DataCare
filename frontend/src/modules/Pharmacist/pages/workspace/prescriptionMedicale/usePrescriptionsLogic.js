import { useEffect, useMemo, useState }  from "react";
import { getSuiviByNumeroDossier }        from "../../../../../shared/services/suiviTherapeutiqueservice";
import { validatePrescription }           from "../../../../../shared/services/prescriptionWorkflowService";
import { toUiPrescriptionItem, MESSAGES } from "./prescriptionsConstants";
import { filterPrescriptions }            from "./prescriptionsHelpers";

import { getPatientsWithPrescriptions }   from "../../../services/patientPrescriptionService";

export function usePrescriptionsLogic() {

  // ── États ──────────────────────────────────────────────────
  const [patients,         setPatients]         = useState([]);
  const [search,           setSearch]           = useState("");
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [showHistory,      setShowHistory]      = useState(true);
  const [detailItem,       setDetailItem]       = useState(null);
  const [validationItem,   setValidationItem]   = useState(null);
  const [savingValidation, setSavingValidation] = useState(false);

  // ── Chargement : liste globale via suivi_therapeutique ────
  // Le backend joint prescription_medicale + stock_medicaments
  // → on récupère nom_traitement (code médicament) + date_prochaine_prise
  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientsWithPrescriptions();
      setPatients(
        Array.isArray(data?.patients)
          ? data.patients.map(toUiPrescriptionItem)
          : [],
      );
    } catch (err) {
      setError(err?.message || err?.error || MESSAGES.erreurChargement);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatients(); }, []);

  // ── Filtrage mémoïsé ──────────────────────────────────────
  const filtered = useMemo(
    () => filterPrescriptions(patients, search),
    [patients, search],
  );

  // ── Détail ────────────────────────────────────────────────
  const openDetail  = (item) => setDetailItem(item);
  const closeDetail = ()     => setDetailItem(null);

  // ── Validation ────────────────────────────────────────────
  const openValidation  = (item) => setValidationItem(item);
  const closeValidation = ()     => { if (!savingValidation) setValidationItem(null); };

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

  // ── Interface publique ────────────────────────────────────
  return {
    search,
    showHistory,
    loading,
    error,
    filtered,
    detailItem,
    validationItem,
    savingValidation,
    setSearch,
    setShowHistory,
    loadPatients,
    openDetail,
    closeDetail,
    openValidation,
    closeValidation,
    handleValidate,
  };
}