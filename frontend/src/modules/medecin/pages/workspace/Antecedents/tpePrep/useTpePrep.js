import { useState, useEffect } from "react";
import {
  getTpePrep,
  createTpePrep,
  updateTpePrep,
  deleteTpePrep,
} from "../../../../services/antecedentsService.jsx";
import { formatTpePrepFromApi, formatTpePrepForApi } from "./tpePrepHelpers";
import { TPE_PREP_INITIAL_STATE } from "./tpePrepConstants";

export default function useTpePrep(numero) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(TPE_PREP_INITIAL_STATE);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [accordeonOpen, setAccordeonOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getTpePrep(numero);
        setItems(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [numero]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm(TPE_PREP_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(TPE_PREP_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(formatTpePrepFromApi(item));
    setShowForm(true);
  };

  const cancelForm = () => resetForm();

  const save = async () => {
    try {
      setSaving(true);
      const payload = formatTpePrepForApi(form);
      const created = await createTpePrep(numero, payload);
      setItems((prev) => [created, ...prev]);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const update = async () => {
    try {
      setSaving(true);
      const payload = formatTpePrepForApi(form);
      const updated = await updateTpePrep(editingItem.id, payload);
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
      await deleteTpePrep(id);
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