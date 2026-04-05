import { useState, useEffect, useCallback, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
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

  const isHandlingBlock = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [numero]);

  const isDirty =
    isEditing &&
    JSON.stringify(form) !== JSON.stringify(savedForm);

  const saveQuiet = useCallback(async () => {
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
  }, [form, isExisting, numero]);

  const blocker = useBlocker(isDirty);

  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (isHandlingBlock.current) return;
    isHandlingBlock.current = true;

    const isAntecedentsNav = blocker.location.pathname.includes("/antecedents/");

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
      const confirmed = window.confirm(
        "Vous avez des modifications non sauvegardées. Voulez-vous enregistrer avant de partir ?"
      );
      if (confirmed) {
        (async () => {
          try {
            await saveQuiet();
            toast.success("Données sauvegardées.");
          } catch {
            toast.error("Erreur lors de la sauvegarde.");
          } finally {
            blocker.proceed();
            isHandlingBlock.current = false;
          }
        })();
      } else {
        blocker.reset();
        isHandlingBlock.current = false;
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state]);

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