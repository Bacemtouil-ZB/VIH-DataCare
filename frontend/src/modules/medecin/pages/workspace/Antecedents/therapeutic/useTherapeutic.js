import { useState, useEffect } from "react";
import { getTherapeutic, createTherapeutic, updateTherapeutic } from "../../../../services/antecedentsService.jsx";
import { formatTherapeuticFromApi, formatTherapeuticForApi } from "./therapeuticHelpers";
import { THERAPEUTIC_INITIAL_STATE } from "./therapeuticConstants";

export default function useTherapeutic(numero) {
  const [form, setForm] = useState(THERAPEUTIC_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(THERAPEUTIC_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getTherapeutic(numero);
        if (data) {
          const formatted = formatTherapeuticFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(THERAPEUTIC_INITIAL_STATE);
          setSavedForm(THERAPEUTIC_INITIAL_STATE);
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
      const payload = formatTherapeuticForApi(form);
      if (isExisting) {
        await updateTherapeutic(numero, payload);
      } else {
        await createTherapeutic(numero, payload);
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