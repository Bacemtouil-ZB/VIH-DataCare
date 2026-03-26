import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { alertError, confirmAction } from "../../../../../shared/utils/uiAlerts";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  updatePrescription,
} from "../../../services/precriptionMedicalService.jsx";
import { INITIAL_FORM } from "./prescreptionMedicalConstants";

export function usePrescreptionMedicalLogic(numero, currentUser) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [isModifying, setIsModifying] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(null);

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

  const medecinDisplayName = useMemo(() => {
    const fullName = `${currentUser?.prenom || ""} ${currentUser?.nom || ""}`.trim();
    return fullName || "Medecin";
  }, [currentUser]);

  const selectedMed = useMemo(
    () => stockItems.find((s) => String(s.id) === String(formData.medicament_id)),
    [stockItems, formData.medicament_id],
  );

  const filtered = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const dateQ = searchDate.trim();
    return prescriptions.filter((p) => {
      const matchesText =
        !q ||
        p.traitement?.toLowerCase().includes(q) ||
        p.statut?.toLowerCase().includes(q) ||
        p.posologie?.toLowerCase().includes(q);

      if (!matchesText) return false;
      if (!dateQ) return true;

      const raw = p.date || p.created_at || "";
      if (!raw) return false;

      const iso = raw instanceof Date ?
          raw.toISOString().split("T")[0]
        : String(raw).split("T")[0];
      return iso === dateQ;
    });
  }, [prescriptions, searchTerm, searchDate]);

  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

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

  const handleMedSelect = (e) => {
    const id = e.target.value;
    const med = stockItems.find((s) => String(s.id) === String(id));
    setFormData((prev) => ({
      ...prev,
      medicament_id: id,
      traitement: med ? (med.code || med.composition || "") : "",
    }));
  };

  const openEdit = async (item) => {
    const ok = await confirmAction(
      "Modifier cette prescription ?",
      `Medicament : ${item.traitement || "-"} - Quantite : ${item.quantite || "-"}`,
    );
    if (!ok) return;

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);
    setFormData({
      medicament_id: String(item.medicament_id || ""),
      traitement: item.traitement || "",
      posologie: item.posologie || "",
      quantite: item.quantite || "",
      dosage: item.dosage || "",
      remarque: item.remarque || "",
    });
    setShowForm(true);
    toast.info("Mode modification active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    setConfirmationModal(null);
    toast.info("Mode details actif");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.medicament_id) {
      toast.warning("Veuillez selectionner un medicament.");
      return;
    }
    if (!formData.posologie?.trim()) {
      toast.warning("La posologie est obligatoire.");
      return;
    }
    if (!formData.quantite || Number(formData.quantite) <= 0) {
      toast.warning("La quantite prescrite doit etre superieure a 0.");
      return;
    }

    setConfirmationModal({
      mode: isModifying ? "update" : "create",
      data: {
        traitement: formData.traitement || selectedMed?.composition || "-",
        posologie: formData.posologie || "-",
        dosage: formData.dosage || "-",
        quantite: formData.quantite || "-",
        remarque: formData.remarque || "-",
      },
    });
  };

  const confirmPrescription = async () => {
    if (!confirmationModal) return;
    try {
      setSaving(true);

      if (confirmationModal.mode === "update") {
        const res = await updatePrescription(editingId, {
          ...formData,
          numero_dossier: numero,
        });
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === editingId ? res.prescription : p)),
        );
        toast.success("Prescription mise a jour.");
      } else {
        const res = await createPrescription({
          ...formData,
          numero_dossier: numero,
        });
        setPrescriptions((prev) => [res.prescription, ...prev]);
        toast.success("Prescription envoyee a la pharmacie.");
      }

      setConfirmationModal(null);
      closeForm();
    } catch (err) {
      alertError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return {
    prescriptions,
    stockItems,
    loading,
    saving,
    showForm,
    showHistory,
    setShowHistory,
    isModifying,
    editingId,
    detailItem,
    setDetailItem,
    formData,
    setFormData,
    searchTerm,
    setSearchTerm,
    searchDate,
    setSearchDate,
    selectedMed,
    filtered,
    field,
    openCreate,
    closeForm,
    handleMedSelect,
    openEdit,
    handleShowDetails,
    handleSubmit,
    confirmationModal,
    closeConfirmationModal,
    confirmPrescription,
    medecinDisplayName,
  };
}
