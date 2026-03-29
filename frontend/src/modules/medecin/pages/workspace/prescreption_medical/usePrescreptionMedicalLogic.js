import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  validatePrescription,
  updateQuantiteDelivree,
} from "../../../../../shared/services/prescriptionWorkflowService.jsx";
import { INITIAL_FORM } from "./prescreptionMedicalConstants";

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

  const selectedMed = useMemo(
    () => stockItems.find((s) => String(s.id) === String(formData.medicament_id)),
    [stockItems, formData.medicament_id],
  );

  const filtered = useMemo(() => {
    const q     = searchTerm.trim().toLowerCase();
    const dateQ = searchDate.trim();
    return prescriptions.filter((p) => {
      const matchesText =
        !q ||
        p.traitement?.toLowerCase().includes(q) ||
        p.statut?.toLowerCase().includes(q)     ||
        p.posologie?.toLowerCase().includes(q);
      if (!matchesText) return false;
      if (!dateQ) return true;
      const raw = p.date || p.created_at || "";
      if (!raw) return false;
      const iso = raw instanceof Date
        ? raw.toISOString().split("T")[0]
        : String(raw).split("T")[0];
      return iso === dateQ;
    });
  }, [prescriptions, searchTerm, searchDate]);

  // ── Helpers formulaire ────────────────────────────────────────
  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

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

  // ── Sélection médicament ──────────────────────────────────────
  const handleMedSelect = (e) => {
    const id  = e.target.value;
    const med = stockItems.find((s) => String(s.id) === String(id));
    setFormData((prev) => ({
      ...prev,
      medicament_id: id,
      traitement: med ? (med.code || med.composition || "") : "",
    }));
  };

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
    if (!formData.medicament_id) {
      toast.warning("Veuillez selectionner un medicament.");
      return;
    }

    if (!formData.quantite || Number(formData.quantite) <= 0) {
      toast.warning("La quantite prescrite doit etre superieure a 0.");
      return;
    }
    setConfirmationModal({
      data: {
        traitement: formData.traitement || selectedMed?.composition || "-",
        posologie:  formData.posologie  || "-",
        dosage:     formData.dosage     || "-",
        quantite:   formData.quantite   || "-",
        remarque:   formData.remarque   || "-",
      },
    });
  };

  // ── Confirmation → POST /add ──────────────────────────────────
  // Champs strictement alignés sur le backend :
  //   numero_dossier → résolu en patient_id côté service backend
  //   medicament_id, posologie, dosage, quantite, remarque
  const confirmPrescription = async () => {
    if (!confirmationModal) return;
    try {
      setSaving(true);
      const res = await createPrescription({
        traitement:     formData.traitement || selectedMed?.composition || "",
        numero_dossier: numero,
        medicament_id:  Number(formData.medicament_id),
        posologie:      formData.posologie || "",
        dosage:         formData.dosage    || null,
        quantite:       Number(formData.quantite),
        remarque:       formData.remarque  || null,
      });
      setPrescriptions((prev) => [res.prescription, ...prev]);
      toast.success("Prescription envoyee a la pharmacie.");
      setConfirmationModal(null);
      closeForm();
    } catch (err) {
      alertError(err?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // ── Validation pharmacien → PATCH /:id/valider ───────────────
  const handleValidate = async (prescriptionId) => {
    try {
      const res = await validatePrescription(prescriptionId);
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === prescriptionId ? res.prescription : p)),
      );
      toast.success("Prescription validee avec succes.");
    } catch (err) {
      alertError(err?.message || "Erreur lors de la validation.");
    }
  };

  return {
    // données
    prescriptions,
    stockItems,
    loading,
    saving,
    showForm,
    showHistory,       setShowHistory,
    detailItem,        setDetailItem,
    formData,
    searchTerm,        setSearchTerm,
    searchDate,        setSearchDate,
    selectedMed,
    filtered,
    confirmationModal,
    medecinDisplayName,
    // actions
    field,
    openCreate,
    closeForm,
    handleMedSelect,
    handleShowDetails,
    handleSubmit,
    closeConfirmationModal,
    confirmPrescription,
    handleValidate,
  };
}