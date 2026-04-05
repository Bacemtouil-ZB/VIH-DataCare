import { useState, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import {
  getTransfusion,
  createTransfusion,
  updateTransfusion,
  deleteTransfusion,
} from "../../../../services/antecedentsService.jsx";
import { formatTransfusionFromApi, formatTransfusionForApi } from "./transfusionHelpers";
import { TRANSFUSION_INITIAL_STATE } from "./transfusionConstants";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";

export default function useTransfusion(numero) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(TRANSFUSION_INITIAL_STATE);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [accordeonOpen, setAccordeonOpen] = useState(true);

  const isHandlingBlock = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTransfusion(numero);
        setItems(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  const isDirty =
    showForm &&
    JSON.stringify(form) !== JSON.stringify(TRANSFUSION_INITIAL_STATE);

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (isHandlingBlock.current) return;
    isHandlingBlock.current = true;

    (async () => {
      try {
        const confirmed = await confirmAction(
          "Formulaire non soumis",
          "Vous avez des données non enregistrées. Voulez-vous quitter sans enregistrer ?"
        );
        if (confirmed) {
          blocker.proceed();
        } else {
          blocker.reset();
        }
      } finally {
        isHandlingBlock.current = false;
      }
    })();
  }, [blocker.state, blocker]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(TRANSFUSION_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(TRANSFUSION_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(formatTransfusionFromApi(item));
    setShowForm(true);
  };

  const cancelForm = () => resetForm();

  const save = async () => {
    try {
      setSaving(true);
      const payload = formatTransfusionForApi(form);
      const created = await createTransfusion(numero, payload);
      setItems((prev) => [created, ...prev]);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const update = async () => {
    try {
      setSaving(true);
      const payload = formatTransfusionForApi(form);
      const updated = await updateTransfusion(editingItem.id, payload);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      setDeleting(true);
      await deleteTransfusion(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setDeleting(false);
    }
  };

  return {
    items,
    form,
    editingItem,
    showForm,
    loading,
    saving,
    deleting,
    error,
    accordeonOpen,
    setAccordeonOpen,
    handleChange,
    openAddForm,
    openEdit,
    cancelForm,
    save,
    update,
    remove,
  };
}