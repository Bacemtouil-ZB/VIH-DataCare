import { useState, useEffect } from "react";
import { getFamily, createFamily, updateFamily } from "../../../../services/antecedentsService.jsx";
import { formatFamilyFromApi, formatFamilyForApi } from "./familyHelpers";
import { FAMILY_INITIAL_STATE } from "./familyConstants";

export default function useFamily(numero) {
  const [form, setForm] = useState(FAMILY_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(FAMILY_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getFamily(numero);
        if (data) {
          const formatted = formatFamilyFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(FAMILY_INITIAL_STATE);
          setSavedForm(FAMILY_INITIAL_STATE);
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
      const payload = formatFamilyForApi(form);
      if (isExisting) {
        await updateFamily(numero, payload);
      } else {
        await createFamily(numero, payload);
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