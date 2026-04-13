import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { confirmDelete } from "../../../../../shared/utils/uiAlerts.js";
import {
  getStockItems,
  createStockItem as createStockItemApi,
  updateStockQuantity as updateStockQuantityApi,
  deleteStockItem as deleteStockItemApi,
} from "../../../services/stockService.jsx";
import { toUiStockItem, INITIAL_ADD_FORM } from "./stockConstants.js";

const getErrorMessage = (error, fallbackMessage) => {
  if (typeof error === "string" && error.trim()) return error;
  if (typeof error?.message === "string" && error.message.trim()) return error.message;
  if (typeof error?.error === "string" && error.error.trim()) return error.error;
  return fallbackMessage;
};

export function useStockLogic(numero) {
  const [search, setSearch] = useState("");
  const [stockItems, setStockItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(INITIAL_ADD_FORM);
  const [editingId, setEditingId] = useState(null);
  const [editingMode, setEditingMode] = useState(null);
  const [editingQuantity, setEditingQuantity] = useState("");
  const [showHistory, setShowHistory] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const refreshStock = async () => {
    const rows = await getStockItems();
    setStockItems(Array.isArray(rows) ? rows.map(toUiStockItem) : []);
  };

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
        setError(getErrorMessage(err, "Erreur lors du chargement du stock."));
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadData();
    return () => {
      alive = false;
    };
  }, [numero]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return stockItems;

    return stockItems.filter(
      (item) =>
        item.code.toLowerCase().includes(query) ||
        item.composition.toLowerCase().includes(query)
    );
  }, [stockItems, search]);

  const handleAddMedication = async () => {
    const { medicamentCode, medicamentComposition, quantityToAdd } = addForm;

    if (!medicamentCode.trim()) {
      toast.error("Veuillez saisir un code de medicament.");
      return;
    }

    if (!medicamentComposition.trim()) {
      toast.error("Veuillez saisir la composition du medicament.");
      return;
    }

    const quantity = Number(quantityToAdd);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      toast.error("La quantite initiale doit etre un entier strictement positif.");
      return;
    }

    try {
      setSaving(true);
      await createStockItemApi({
        code: medicamentCode.trim().toUpperCase(),
        composition: medicamentComposition.trim(),
        quantite: quantity,
      });
      await refreshStock();
      cancelAddForm();
      toast.success("Medicament ajoute avec succes");
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur lors de l'ajout au stock."));
    } finally {
      setSaving(false);
    }
  };

  const cancelAddForm = () => {
    setShowAddForm(false);
    setAddForm(INITIAL_ADD_FORM);
  };

  const handleDeleteMedication = async (id) => {
    const confirmed = await confirmDelete(
      "Supprimer ce medicament ?",
      "Etes-vous sur de vouloir supprimer ce medicament du stock ?"
    );
    if (!confirmed) return;

    try {
      setSaving(true);
      await deleteStockItemApi(id);
      await refreshStock();
      toast.success("Medicament supprime avec succes");
      if (editingId === id) cancelEditQuantity();
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur lors de la suppression."));
    } finally {
      setSaving(false);
    }
  };

  const beginIncrement = (item) => {
    setEditingId(item.id);
    setEditingMode("increment");
    setEditingQuantity("");
  };

  const beginDecrement = (item) => {
    setEditingId(item.id);
    setEditingMode("decrement");
    setEditingQuantity("");
  };

  const cancelEditQuantity = () => {
    setEditingId(null);
    setEditingMode(null);
    setEditingQuantity("");
  };

  const saveQuantity = async (item) => {
    const delta = Number(editingQuantity);
    if (!Number.isInteger(delta) || delta <= 0) {
      toast.error("Veuillez saisir un entier strictement positif.");
      return;
    }

    const current = Number.isFinite(Number(item?.quantity)) ? Number(item.quantity) : 0;
    if (editingMode === "decrement" && delta > current) {
      toast.error(`La quantite a retirer ne peut pas depasser le stock actuel (${current}).`);
      return;
    }

    const newQuantity = editingMode === "decrement" ? current - delta : current + delta;

    try {
      setSaving(true);
      await updateStockQuantityApi(item.id, newQuantity);
      await refreshStock();
      cancelEditQuantity();
      toast.success(
        editingMode === "decrement"
          ? `Stock diminue de ${delta} unite(s)`
          : `Stock augmente de ${delta} unite(s)`
      );
    } catch (err) {
      toast.error(getErrorMessage(err, "Erreur lors de la mise a jour."));
    } finally {
      setSaving(false);
    }
  };

  return {
    search,
    setSearch,
    showAddForm,
    setShowAddForm,
    addForm,
    setAddForm,
    editingId,
    editingMode,
    editingQuantity,
    setEditingQuantity,
    showHistory,
    setShowHistory,
    loading,
    saving,
    error,
    filteredItems,
    handleAddMedication,
    cancelAddForm,
    handleDeleteMedication,
    beginIncrement,
    beginDecrement,
    cancelEditQuantity,
    saveQuantity,
  };
}
