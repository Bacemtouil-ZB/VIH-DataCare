import { useEffect, useMemo, useState }  from "react";
import { getPatientsWithPrescriptions }  from "../../../services/patientPrescriptionService";
import { validatePrescription }          from "../../../../../shared/services/prescriptionWorkflowService";
import { toUiPrescriptionItem, MESSAGES } from "./prescriptionsPharmaConstants";
import { filterPrescriptions }           from "./PrescriptionsPharmahelpers";

export function usePrescriptionsLogic() {

  const [patients,         setPatients]         = useState([]);
  const [search,           setSearch]           = useState("");
  const [loading,          setLoading]          = useState(true);
  const [error,            setError]            = useState(null);
  const [showHistory,      setShowHistory]      = useState(true);
  const [detailItem,       setDetailItem]       = useState(null);
  const [validationItem,   setValidationItem]   = useState(null);
  const [savingValidation, setSavingValidation] = useState(false);

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPatientsWithPrescriptions();
      // data.patients contient maintenant nom_traitement + date_prochaine_prise
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

  const filtered = useMemo(
    () => filterPrescriptions(patients, search),
    [patients, search],
  );

  const openDetail  = (item) => setDetailItem(item);
  const closeDetail = ()     => setDetailItem(null);

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

  return {
    search, showHistory, loading, error, filtered,
    detailItem, validationItem, savingValidation,
    setSearch, setShowHistory,
    loadPatients, openDetail, closeDetail,
    openValidation, closeValidation, handleValidate,
  };
}