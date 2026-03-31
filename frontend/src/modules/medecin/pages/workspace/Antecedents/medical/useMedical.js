import { useState, useEffect } from "react";
import { getMedical, createMedical, updateMedical } from "../../../../services/antecedentsService.jsx";
import { formatMedicalFromApi, formatMedicalForApi } from "./medicalHelpers";
import { MEDICAL_INITIAL_STATE } from "./medicalConstants";

export default function useMedical(numero) {
  const [form, setForm] = useState(MEDICAL_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(MEDICAL_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getMedical(numero);
        if (data) {
          const formatted = formatMedicalFromApi(data);
          setForm(formatted);
          setSavedForm(formatted);
          setIsExisting(true);
          setIsEditing(false);
        } else {
          setForm(MEDICAL_INITIAL_STATE);
          setSavedForm(MEDICAL_INITIAL_STATE);
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
      const payload = formatMedicalForApi(form);
      if (isExisting) {
        await updateMedical(numero, payload);
      } else {
        await createMedical(numero, payload);
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