import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import { toInputDate } from "../../../../../shared/utils/dateHelpers";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  validatePrescription,
} from "../../../../../shared/services/prescriptionWorkflowService.jsx";
import { INITIAL_FORM } from "./prescreptionMedicalConstants";
// import { clearFieldError } from "../../../../../shared/components/Forms/FieldLabel/clearFieldError";

export function usePrescreptionMedicalLogic(numero, currentUser) {
  const [prescriptions,     setPrescriptions]    = useState([]);
  const [stockItems,        setStockItems]        = useState([]);
  const [loading,           setLoading]           = useState(true);
  const [saving,            setSaving]            = useState(false);
  const [showForm,          setShowForm]          = useState(false);
  const [showHistory,       setShowHistory]       = useState(true);
  const [detailItem,        setDetailItem]        = useState(null);
  const [formData,          setFormData]          = useState(INITIAL_FORM);
  const [searchTerm,        setSearchTerm]        = useState("");
  const [searchDate,        setSearchDate]        = useState("");
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [patient,           setPatient]           = useState(null);

  // ── Chargement initial ────────────────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [presRes, stockRes] = await Promise.all([
          getPrescriptionsByNumeroDossier(numero),
          getStockMedicaments(),
        ]);
        setPrescriptions(presRes.prescriptions || []);
        setStockItems(stockRes.items || []);
        setPatient(presRes.patient || null);
      } catch {
        alertError("Impossible de charger les donnees.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);

  // ── Dérivés ───────────────────────────────────────────────────
  const medecinDisplayName = useMemo(() => {
    const fullName = `${currentUser?.prenom || ""} ${currentUser?.nom || ""}`.trim();
    return fullName || "Medecin";
  }, [currentUser]);


  
  // ── Filtered — plus de groupement, backend renvoie 1 ligne par ordonnance ──
  const filtered = useMemo(() => {
    const q     = searchTerm.trim().toLowerCase();
    const dateQ = searchDate.trim();
    

    return prescriptions.filter((p) => {
      // les noms viennent depuis medicaments[]
      const nomsStr = (p.medicaments || [])
        .map((m) => m.medicament_nom_snapshot || "")
        .join(", ")
        .toLowerCase();

      const matchesText =
        !q ||
        nomsStr.includes(q) ||
        (p.statut || "").toLowerCase().includes(q);

      if (!matchesText) return false;
      if (!dateQ) return true;

      const raw = p.date || p.created_at || "";
      if (!raw) return false;
      return toInputDate(raw) === dateQ;
    });

    
  }, [prescriptions, searchTerm, searchDate]);

  // ── Helpers formulaire ────────────────────────────────────────
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const setMedicamentIds = (ids) =>
    setFormData((prev) => ({ ...prev, medicament_ids: ids }));

  const resetForm = () => setFormData(INITIAL_FORM);

  const openCreate = () => {
    setDetailItem(null);
    setConfirmationModal(null);
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
    setConfirmationModal(null);
  };

  const closeConfirmationModal = () => setConfirmationModal(null);

  

  // ── Détail ────────────────────────────────────────────────────
  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    setConfirmationModal(null);
  };

  // ── Soumission → modal de confirmation ───────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.medicament_ids.length) {
      toast.warning("Veuillez selectionner au moins un medicament.");
      return;
    }
    if (!formData.periode || Number(formData.periode) <= 0) {
      toast.warning("La duree prescrite doit etre superieure a 0.");
      return;
    }

    const selectedMeds = stockItems.filter((s) =>
      formData.medicament_ids.includes(String(s.id))
    );

    const traitementsLabel = selectedMeds
      .map((m) => m.code || m.composition || "Medicament")
      .join(", ");

    setConfirmationModal({
      data: {
        patient:    patient
          ? `${patient.surname || ""} ${patient.name || ""}`.trim()
          : "-",
        dossier:    numero || "-",
        traitement: traitementsLabel || "-",
        posologie:  formData.posologie || "-",
        periode:    formData.periode ? `${formData.periode} jours` : "-",
        remarque:   formData.remarque || "-",
        _medicament_ids: formData.medicament_ids,
        _posologie:      formData.posologie || null,
        _periode:        Number(formData.periode),
        _remarque:       formData.remarque   || null,
      },
    });
  };

  // ── Confirmation → UN SEUL POST avec tableau de médicaments ──
  const confirmPrescription = async () => {
    if (!confirmationModal) return;
    const { _medicament_ids, _posologie, _periode, _remarque } =
      confirmationModal.data;

    try {
      setSaving(true);

      const result = await createPrescription({
        numero_dossier:  numero,
        medicament_ids:  _medicament_ids.map(Number),
        posologie:       _posologie,
        periode:         _periode,
        remarque:        _remarque,
      });

      // backend renvoie 1 prescription avec medicaments[]
      const newPrescription = result.prescription;
      if (newPrescription) {
        setPrescriptions((prev) => [newPrescription, ...prev]);
      }

      toast.success("Prescription envoyee a la pharmacie.");
      setConfirmationModal(null);
      closeForm();
    } catch (err) {
      alertError(err?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // ── Validation pharmacien ─────────────────────────────────────
  const handleValidate = async (prescriptionId) => {
    try {
      const res = await validatePrescription(prescriptionId);
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === prescriptionId ? res.prescription : p))
      );
      toast.success("Prescription validee avec succes.");
    } catch (err) {
      alertError(err?.message || "Erreur lors de la validation.");
    }
  };

  return {
    prescriptions,
    stockItems,
    loading,
    saving,
    showForm,
    showHistory,        setShowHistory,
    detailItem,         setDetailItem,
    formData,
    searchTerm,         setSearchTerm,
    searchDate,         setSearchDate,
    filtered,
    confirmationModal,
    medecinDisplayName,
    field,
      openCreate,
    closeForm,
    handleShowDetails,
    handleSubmit,
    closeConfirmationModal,
    confirmPrescription,
    handleValidate,
    setMedicamentIds,
  };
}
