import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmDelete } from "../../../../../shared/utils/uiAlerts.js";
import {
  getStockItems,
  createStockItem     as createStockItemApi,
  updateStockQuantity as updateStockQuantityApi,
  deleteStockItem     as deleteStockItemApi,
} from "../../../services/stockService.jsx";
import { toUiStockItem, INITIAL_ADD_FORM } from "./stockConstants.js";

export function useStockLogic(numero) {
  // ── États ──────────────────────────────────────────────────────────────────
  const [search,           setSearch]           = useState("");
  const [stockItems,       setStockItems]        = useState([]);
  const [showAddForm,      setShowAddForm]       = useState(false);
  const [addForm,          setAddForm]           = useState(INITIAL_ADD_FORM);
  const [editingId,        setEditingId]         = useState(null);
  const [editingQuantity,  setEditingQuantity]   = useState("");
  const [showHistory,      setShowHistory]       = useState(true);
  const [loading,          setLoading]           = useState(true);
  const [saving,           setSaving]            = useState(false);
  const [error,            setError]             = useState("");

  // ── Refresh ────────────────────────────────────────────────────────────────
  const refreshStock = async () => {
    const rows = await getStockItems();
    setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);
  };

  // ── Chargement initial ─────────────────────────────────────────────────────
  useEffect(() => {
    let alive = true;
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const rows = await getStockItems();
        if (!alive) return;
        setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);
      } catch (err) {
        if (!alive) return;
        setError(err?.message || "Erreur lors du chargement du stock.");
      } finally {
        if (alive) setLoading(false);
      }
    };
    loadData();
    return () => { alive = false; };
  }, [numero]);

  // ── Filtrage ───────────────────────────────────────────────────────────────
  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return stockItems;
    return stockItems.filter(
      (item) =>
        item.code.toLowerCase().includes(q) ||
        item.composition.toLowerCase().includes(q)
    );
  }, [stockItems, search]);

  // ── Ajouter médicament ─────────────────────────────────────────────────────
  const handleAddMedication = async () => {
    const { medicamentCode, medicamentComposition, quantityToAdd } = addForm;

    if (!medicamentCode.trim()) {
      toast.error("Veuillez saisir un code de médicament.");
      return;
    }
    if (!medicamentComposition.trim()) {
      toast.error("Veuillez saisir la composition du médicament.");
      return;
    }
    const q = Number(quantityToAdd);
    if (!Number.isInteger(q) || q < 0) {
      toast.error("La quantité doit être un entier positif.");
      return;
    }

    try {
      setSaving(true);
      await createStockItemApi({
        code:        medicamentCode.trim().toUpperCase(),
        composition: medicamentComposition.trim(),
        quantite:    q,
      });
      await refreshStock();
      cancelAddForm();
      toast.success("Médicament ajouté avec succès");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de l'ajout au stock.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const cancelAddForm = () => {
    setShowAddForm(false);
    setAddForm(INITIAL_ADD_FORM);
  };

  // ── Supprimer médicament ───────────────────────────────────────────────────
  const handleDeleteMedication = async (id) => {
    const confirmed = await confirmDelete(
      "Supprimer ce médicament ?",
      "Êtes-vous sûr de vouloir supprimer ce médicament du stock ?"
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteStockItemApi(id);
      await refreshStock();
      toast.success("Médicament supprimé avec succès");
      if (editingId === id) {
        setEditingId(null);
        setEditingQuantity("");
      }
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de la suppression.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  // ── Modifier quantité ──────────────────────────────────────────────────────
  const beginEditQuantity = (item) => {
    setEditingId(item.id);
    setEditingQuantity(String(item.quantity));
  };

  const cancelEditQuantity = () => {
    setEditingId(null);
    setEditingQuantity("");
  };

  const saveQuantity = async (item) => {
    const q = Number(editingQuantity);
    if (!Number.isInteger(q) || q < 0) {
      toast.error("La quantité doit être un entier positif.");
      return;
    }
    try {
      setSaving(true);
      await updateStockQuantityApi(item.id, q);
      await refreshStock();
      cancelEditQuantity();
      toast.success("Quantité mise à jour avec succès");
    } catch (err) {
      const msg = err?.response?.data?.message || err?.message || "Erreur lors de la mise à jour.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return {
    search,          setSearch,
    showAddForm,     setShowAddForm,
    addForm,         setAddForm,
    editingId,
    editingQuantity, setEditingQuantity,
    showHistory,     setShowHistory,
    loading,
    saving,
    error,
    filteredItems,
    handleAddMedication,
    cancelAddForm,
    handleDeleteMedication,
    beginEditQuantity,
    cancelEditQuantity,
    saveQuantity,
  };
}