//cheked 15/04/2026
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { confirmAction, alertError } from "../../../../../shared/utils/uiAlerts";
import {
  getBilansByNumeroDossier,
  createBilan,
  updateBilan,
} from "../../../services/bilanExamenService";
import { INITIAL_FORM } from "./Bilanexamenconstants";
import { applyToggle, countChecked, extractBilanFields } from "./Bilanexamenhelpers";

export function useBilanExamenLogic(numero) {

  // ── États ──────────────────────────────────────────────────
  const [bilans,       setBilans]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [saving,       setSaving]       = useState(false);
  const [showForm,     setShowForm]     = useState(false);
  const [showHistory,  setShowHistory]  = useState(true);
  const [isModifying,  setIsModifying]  = useState(false);
  const [editingId,    setEditingId]    = useState(null);
  const [detailItem,   setDetailItem]   = useState(null);
  const [formData,     setFormData]     = useState(INITIAL_FORM);

  // ── Chargement initial ────────────────────────────────────
  useEffect(() => {
    if (!numero) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getBilansByNumeroDossier(numero);
        setBilans(res.bilans || []);
      } catch (err) {
        toast.error(err?.message || "Erreur lors du chargement des bilans");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  // ── Reset formulaire ──────────────────────────────────────
  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setIsModifying(false);
    setEditingId(null);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  // ── Toggle bilan ──────────────────────────────────────────
  const handleToggle = (key) => {
    setFormData((prev) => applyToggle(prev, key));
  };

  // ── Ouvrir création ───────────────────────────────────────
  const openCreate = () => {
    setDetailItem(null);
    resetForm();
    setShowForm(true);
  };

  // ── Ouvrir modification ───────────────────────────────────
  const openEdit = async (item) => {

    setDetailItem(null);
    setIsModifying(true);
    setEditingId(item.id);
    setFormData(extractBilanFields(item));
    setShowForm(true);
    toast.info("Mode modification activé");
  };

  // ── Afficher le détail ────────────────────────────────────
  const handleShowDetails = (item) => {
    setShowForm(false);
    resetForm();
    setDetailItem(item);
  };

  const closeDetail = () => {
    setDetailItem(null);
  };

  // ── Soumission formulaire ─────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const nbChecked = countChecked(formData);
    if (nbChecked === 0) {
      toast.warning("Veuillez sélectionner au moins un bilan.");
      return;
    }

     await confirmAction(
      isModifying ? "Enregistrer les modifications ?" : "Créer ce bilan ?",
      `${nbChecked} bilan(s) sélectionné(s) — les données seront enregistrées.`,
    );

    try {
      setSaving(true);
      if (isModifying && editingId) {
        const res = await updateBilan(editingId, formData);
        setBilans((prev) => prev.map((b) => (b.id === editingId ? res.bilan : b)));
        toast.success("Bilan mis à jour.");
      } else {
        const res = await createBilan({ ...formData, numero_dossier: numero });
        setBilans((prev) => [res.bilan, ...prev]);
        toast.success("Bilan enregistré.");
      }
      closeForm(false);
    } catch (err) {
      await alertError(err?.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  // ── Interface publique ────────────────────────────────────
  return {
    // état
    bilans,
    loading,
    saving,
    showForm,
    showHistory,  setShowHistory,
    isModifying,
    detailItem,
    formData,     setFormData,
    // actions
    openCreate,
    closeForm,
    openEdit,
    handleShowDetails,
    closeDetail,
    handleToggle,
    handleSubmit,
  };
}