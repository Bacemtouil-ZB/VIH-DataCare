import { useState, useEffect } from "react";
import { getHabitudesVie, createHabitudesVie, updateHabitudesVie } from "../../../../services/antecedentsService.jsx";
import { formatHabitudesVieFromApi, formatHabitudesVieForApi } from "./habitudesVieHelpers";
import { HABITUDES_VIE_INITIAL_STATE } from "./habitudesVieConstants";

export default function useHabitudesVie(numero) {
  const [form, setForm] = useState(HABITUDES_VIE_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(HABITUDES_VIE_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getHabitudesVie(numero);
        if (data) {
          const formatted = formatHabitudesVieFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(HABITUDES_VIE_INITIAL_STATE);
          setSavedForm(HABITUDES_VIE_INITIAL_STATE);
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

  const handleToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
      const payload = formatHabitudesVieForApi(form);
      if (isExisting) {
        await updateHabitudesVie(numero, payload);
      } else {
        await createHabitudesVie(numero, payload);
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
    handleToggle,
    handleChange,
    startEditing,
    cancelEditing,
    save,
  };
}