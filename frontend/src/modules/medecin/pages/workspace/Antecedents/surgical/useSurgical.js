import { useState, useEffect } from "react";
import {
  getSurgical,
  createSurgical,
  updateSurgical,
  deleteSurgical,
} from "../../../../services/antecedentsService.jsx";
import { formatSurgicalFromApi, formatSurgicalForApi } from "./surgicalHelpers";
import { SURGICAL_INITIAL_STATE } from "./surgicalConstants";

export default function useSurgical(numero) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(SURGICAL_INITIAL_STATE);
  const [editingItem, setEditingItem] = useState(null); // null = mode ajout | object = mode édition
  const [showForm, setShowForm] = useState(false);      // formulaire caché par défaut
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [accordeonOpen, setAccordeonOpen] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSurgical(numero);
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
    setForm(SURGICAL_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    setForm(SURGICAL_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm(formatSurgicalFromApi(item));
    setShowForm(true);
  };

  const cancelForm = () => resetForm();

  const save = async () => {
    try {
      setSaving(true);
      const payload = formatSurgicalForApi(form);
      const created = await createSurgical(numero, payload);
      setItems((prev) => [created, ...prev]);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const update = async () => {
    try {
      setSaving(true);
      const payload = formatSurgicalForApi(form);
      const updated = await updateSurgical(editingItem.id, payload);
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
      await deleteSurgical(id);
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