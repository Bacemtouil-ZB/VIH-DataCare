import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import {
  createPrescription,
  getPrescriptionsByNumeroDossier,
  getStockMedicaments,
  updatePrescription,
} from "../../../services/precriptionMedicalService.jsx";
import { INITIAL_FORM } from "./prescreptionMedicalConstants";

export function usePrescreptionMedicalLogic(numero) {
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
      } catch (err) {
        alertError("Impossible de charger les données.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [numero]);

  const selectedMed = useMemo(
    () => stockItems.find((s) => String(s.id) === String(formData.medicament_id)),
    [stockItems, formData.medicament_id]
  );

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return prescriptions;
    const q = searchTerm.toLowerCase();
    return prescriptions.filter(
      (p) =>
        p.traitement?.toLowerCase().includes(q) ||
        p.statut?.toLowerCase().includes(q) ||
        p.posologie?.toLowerCase().includes(q)
    );
  }, [prescriptions, searchTerm]);

  const field = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const openCreate = () => {
    setDetailItem(null);
    resetForm();
    setShowForm(true);
  };

  const closeForm = (notify = true) => {
    resetForm();
    setShowForm(false);
    if (notify) toast.info("Opération annulée");
  };

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
      `Médicament : ${item.traitement || "-"} - Date : ${item.date ? item.date.slice(0, 10) : "-"}`,
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);
    setFormData({
      medicament_id: String(item.medicament_id || ""),
      traitement: item.traitement || "",
      posologie: item.posologie || "",
      date: item.date ? item.date.slice(0, 10) : "",
      quantite: item.quantite || "",
      dosage: item.dosage || "",
      remarque: item.remarque || "",
    });
    setShowForm(true);
    toast.info("Mode modification activé");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
    toast.info("Mode détails actif");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.medicament_id) {
      toast.warning("Veuillez sélectionner un médicament.");
      return;
    }
    if (!formData.date) {
      toast.warning("La date est obligatoire.");
      return;
    }
    const ok = await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer cette prescription ?",
      "Les données seront enregistrées dans le dossier patient.",
    );
    if (!ok) { toast.info("Opération annulée"); return; }

    try {
      setSaving(true);
      if (isModifying) {
        const { statut: _s, ...formWithoutStatut } = formData;
        const res = await updatePrescription(editingId, {
          ...formWithoutStatut,
          numero_dossier: numero,
        });
        setPrescriptions((prev) =>
          prev.map((p) => (p.id === editingId ? res.prescription : p))
        );
        toast.success("Prescription mise à jour.");
      } else {
        const { statut: _s2, ...formWithoutStatut2 } = formData;
        const res = await createPrescription({
          ...formWithoutStatut2,
          numero_dossier: numero,
        });
        setPrescriptions((prev) => [res.prescription, ...prev]);
        toast.success("Prescription créée avec succès.");
      }
      closeForm(false);
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
    selectedMed,
    filtered,
    field,
    openCreate,
    closeForm,
    handleMedSelect,
    openEdit,
    handleShowDetails,
    handleSubmit,
  };
}
