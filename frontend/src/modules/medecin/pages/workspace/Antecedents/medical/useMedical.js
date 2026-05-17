//cheked 15/04/2026
import { useState, useEffect, useCallback, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
import { confirmAction } from "../../../../../../shared/utils/uiAlerts";
import { getMedical, createMedical, updateMedical } from "../../../../services/antecedentsService.jsx";
import { formatMedicalFromApi, formatMedicalForApi } from "./medicalHelpers";
import { MEDICAL_INITIAL_STATE } from "./medicalConstants";
import { clearFieldError } from "../../../../../../shared/components/Forms/FieldLabel/clearFieldError";
 
export default function useMedical(numero) {
  const [form, setForm] = useState(MEDICAL_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(MEDICAL_INITIAL_STATE);
  const [isExisting, setIsExisting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
 
  const isHandlingBlock = useRef(false);
 
  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [numero]);
 
  const isDirty = isEditing && JSON.stringify(form) !== JSON.stringify(savedForm);
 
  const saveQuiet = useCallback(async () => {
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
  }, [form, isExisting, numero]);
 
  const blocker = useBlocker(isDirty);
 
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (isHandlingBlock.current) return;
    isHandlingBlock.current = true;
 
    const isAntecedentsNav = blocker.location.pathname.includes("/antecedents/"); // used to identify if navigation is within the antecedents section
 
    if (isAntecedentsNav) {
      (async () => {
        try {
          await saveQuiet();
          toast.success("Données sauvegardées automatiquement.");
        } catch {
          toast.error("Erreur lors de la sauvegarde automatique.");
        } finally {
          blocker.proceed();
          isHandlingBlock.current = false;
        }
      })();
    } else {
      (async () => {
        const confirmed = await confirmAction(
          "Vous avez des modifications non sauvegardées. Voulez-vous enregistrer avant de partir ?"
        );
        if (confirmed) {
          try {
            await saveQuiet();
            toast.success("Données sauvegardées.");
          } catch {
            toast.error("Erreur lors de la sauvegarde.");
          } finally {
            blocker.proceed();
            isHandlingBlock.current = false;
          }
        } else {
          blocker.reset();
          isHandlingBlock.current = false;
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);
 
  const handleToggle = (key) => {
    setForm((prev) => ({ ...prev, [key]: !prev[key] }));
  };
 
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    clearFieldError(key, setErrors);
  };
 
  const startEditing = () => setIsEditing(true);
 
  const cancelEditing = () => {
    setForm(savedForm);
    setErrors({});
    setIsEditing(false);
  };
 
  const save = async () => {
    setErrors({});
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
 
  return {
    form,
    isExisting,
    isEditing,
    loading,
    saving,
    error,
    errors,
    setErrors,
    handleToggle,
    handleChange,
    startEditing,
    cancelEditing,
    save,
  };
}
 