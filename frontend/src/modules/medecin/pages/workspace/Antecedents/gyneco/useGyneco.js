import { useState, useEffect } from "react";
import { getGyneco, createGyneco, updateGyneco } from "../../../../services/antecedentsService.jsx";
import { formatGynecoFromApi, formatGynecoForApi } from "./gynecoHelpers";
import { GYNECO_INITIAL_STATE } from "./gynecoConstants";

export default function useGyneco(numero) {
  const [form, setForm] = useState(GYNECO_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(GYNECO_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getGyneco(numero);
        if (data) {
          const formatted = formatGynecoFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(GYNECO_INITIAL_STATE);
          setSavedForm(GYNECO_INITIAL_STATE);
          setIsExisting(false);
          setIsEditing(true);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [numero]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const startEditing = () => setIsEditing(true);

  const cancelEditing = () => {
    setForm(savedForm);
    setIsEditing(false);
  };

  const save = async () => {
    try {
      setSaving(true);
      const payload = formatGynecoForApi(form);
      if (isExisting) {
        await updateGyneco(numero, payload);
      } else {
        await createGyneco(numero, payload);
        setIsExisting(true);
      }
      setSavedForm(form);
      setIsEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    isExisting,
    isEditing,
    loading,
    saving,
    error,
    handleChange,
    startEditing,
    cancelEditing,
    save,
  };
}