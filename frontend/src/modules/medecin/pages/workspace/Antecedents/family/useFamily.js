import { useState, useEffect, useCallback, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
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

  const isHandlingBlock = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
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
    fetchData();
  }, [numero]);

  const isDirty =
    isEditing &&
    JSON.stringify(form) !== JSON.stringify(savedForm);

  const saveQuiet = useCallback(async () => {
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