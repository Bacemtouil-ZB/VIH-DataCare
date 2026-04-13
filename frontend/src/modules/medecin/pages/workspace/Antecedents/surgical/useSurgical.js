import { useState, useEffect, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
import { getSurgical, createSurgical, updateSurgical, deleteSurgical } from "../../../../services/antecedentsService.jsx";
import { formatSurgicalFromApi, formatSurgicalForApi } from "./surgicalHelpers";
import { SURGICAL_INITIAL_STATE } from "./surgicalConstants";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";
import { clearFieldError } from "../../../../shared/utils/clearFieldError.js";
 
export default function useSurgical(numero) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(SURGICAL_INITIAL_STATE);
  const [editingItem, setEditingItem] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [accordeonOpen, setAccordeonOpen] = useState(true);
 
  const isHandlingBlock = useRef(false);
 
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
 
  const isDirty = showForm && JSON.stringify(form) !== JSON.stringify(SURGICAL_INITIAL_STATE);
 
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
    clearFieldError(key, setErrors);
  };
 
  const resetForm = () => {
    setForm(SURGICAL_INITIAL_STATE);
    setEditingItem(null);
    setShowForm(false);
    setErrors({});
  };
 
  const openAddForm = () => {
    setForm(SURGICAL_INITIAL_STATE);
    setEditingItem(null);
    setErrors({});
    setShowForm(true);
  };
 
  const openEdit = (item) => {
    setEditingItem(item);
    setForm(formatSurgicalFromApi(item));
    setErrors({});
    setShowForm(true);
  };
 
  const cancelForm = () => resetForm();
 
  const save = async () => {
    setErrors({});
    try {
      setSaving(true);
      const payload = formatSurgicalForApi(form);
      const created = await createSurgical(numero, payload);
      setItems((prev) => [created, ...prev]);
      resetForm();
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const formattedErrors = {};
        err.errors.forEach((e) => {
          formattedErrors[e.field] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setSaving(false);
    }
  };
 
  const update = async () => {
    setErrors({});
    try {
      setSaving(true);
      const payload = formatSurgicalForApi(form);
      const updated = await updateSurgical(editingItem.id, payload);
      setItems((prev) =>
        prev.map((item) => (item.id === updated.id ? updated : item))
      );
      resetForm();
    } catch (err) {
      if (err?.errors && Array.isArray(err.errors)) {
        const formattedErrors = {};
        err.errors.forEach((e) => {
          formattedErrors[e.field] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        toast.error("Une erreur est survenue. Veuillez réessayer.");
      }
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
    errors,
    setErrors,
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
 