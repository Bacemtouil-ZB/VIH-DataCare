
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { alertError } from "../../../../../shared/utils/uiAlerts";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  validatePrescription,
} from "../../../../../shared/services/prescriptionWorkflowService.jsx";
import { INITIAL_FORM, VALIDATION_MESSAGES } from "./prescreptionMedicalConstants";
import { 
  filterPrescriptions,
  validatePrescriptionForm,
  buildConfirmationData,
  filterStockItems,
  getSelectedMedicines,
  removeSelectedMedicineId,
  toggleSelectedMedicineId,
} from "./prescreptionMedicalHelpers";

export function useMedicationMultiSelect(stockItems, selectedIds, onChange) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const filtered = useMemo(
    () => filterStockItems(stockItems, search),
    [stockItems, search]
  );

  const selectedMeds = useMemo(
    () => getSelectedMedicines(stockItems, selectedIds),
    [stockItems, selectedIds]
  );

  const toggleMedicine = (id) => onChange(toggleSelectedMedicineId(selectedIds, id));

  const removeMedicine = (id) => onChange(removeSelectedMedicineId(selectedIds, id));

  const closeDropdown = () => setOpen(false);

  const toggleDropdown = () => setOpen((prev) => !prev);

  return {
    open,
    search,
    filtered,
    selectedMeds,
    wrapperRef,
    setSearch,
    closeDropdown,
    toggleDropdown,
    toggleMedicine,
    removeMedicine,
  };
}

export function usePrescreptionMedicalLogic(numero, currentUser) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  //lopération de sauvegarde est en cours
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [detailItem, setDetailItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [patient, setPatient] = useState(null);


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
        alertError(VALIDATION_MESSAGES.errorLoad);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);
  console.log("Prescriptions chargées:", patient);


  const medecinDisplayName = useMemo(() => {
    const fullName = `${currentUser?.prenom || ""} ${currentUser?.nom || ""}`.trim();
    return fullName || "Medecin";
  }, [currentUser]);

  const filtered = useMemo(
    () => filterPrescriptions(prescriptions, searchTerm, searchDate),
    [prescriptions, searchTerm, searchDate]
  );

//maj un champ précis
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

  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    setConfirmationModal(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Valider les données
    const validation = validatePrescriptionForm(formData);
    if (!validation.valid) {
      toast.warning(validation.error);
      return;
    }

    // Construire les données de confirmation
    const confirmData = buildConfirmationData(
      formData,
      stockItems,
      patient,
      numero
    );

    setConfirmationModal({ data: confirmData });
  };

  const confirmPrescription = async () => {
    if (!confirmationModal) return;
    const { _medicament_ids, _posologie, _periode, _remarque } =
      confirmationModal.data;

    try {
      setSaving(true);

      const result = await createPrescription({
        numero_dossier: numero,
        medicament_ids: _medicament_ids.map(Number),
        posologie: _posologie,
        periode: _periode,
        remarque: _remarque,
      });

      // maj de la liste
      const newPrescription = result.prescription;
      if (newPrescription) {
        setPrescriptions((prev) => [newPrescription, ...prev]);
      }

      toast.success(VALIDATION_MESSAGES.successCreate);
      setConfirmationModal(null);
      closeForm();
    } catch (err) {
      alertError(err?.message || VALIDATION_MESSAGES.errorSave);
    } finally {
      setSaving(false);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // Validation par le pharmacien
  // ──────────────────────────────────────────────────────────────
  const handleValidate = async (prescriptionId) => {
    try {
      const res = await validatePrescription(prescriptionId);
      setPrescriptions((prev) =>
        prev.map((p) => (p.id === prescriptionId ? res.prescription : p))
      );
      toast.success(VALIDATION_MESSAGES.successValidate);
    } catch (err) {
      alertError(err?.message || VALIDATION_MESSAGES.errorValidate);
    }
  };

  // ──────────────────────────────────────────────────────────────
  // Retour public
  // ──────────────────────────────────────────────────────────────
  return {
    // Données
    prescriptions,
    stockItems,
    filtered,
    formData,
    detailItem,
    confirmationModal,

    // État d'affichage
    loading,
    saving,
    showForm,
    showHistory,
    isModifying: false, 
    medecinDisplayName,

    // Handlers d'affichage
    setShowHistory,
    setDetailItem,
    handleShowDetails,

    // Handlers de formulaire
    field,
    setSearchTerm,
    setSearchDate,
    setMedicamentIds,
    openCreate,
    closeForm,
    closeConfirmationModal,

    // Handlers d'action
    handleSubmit,
    confirmPrescription,
    handleValidate,

    // Propriétés dynamiques
    searchTerm,
    searchDate,
  };
}
