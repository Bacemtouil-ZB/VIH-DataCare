//cheked 15/04/2026
import { useState, useEffect, useCallback, useRef } from "react";
import { useBlocker } from "react-router-dom";
import { toast } from "react-toastify";
import { getGyneco, createGyneco, updateGyneco } from "../../../../services/antecedentsService.jsx";
import { formatGynecoFromApi, formatGynecoForApi } from "./gynecoHelpers";
import { GYNECO_INITIAL_STATE } from "./gynecoConstants";
import { clearFieldError } from "../../../../../../shared/components/Forms/FieldLabel/clearFieldError";

export default function useGyneco(numero) {
  const [form, setForm] = useState(GYNECO_INITIAL_STATE);
  const [savedForm, setSavedForm] = useState(GYNECO_INITIAL_STATE);
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
    fetchData();
  }, [numero]);

  const isDirty = isEditing && JSON.stringify(form) !== JSON.stringify(savedForm);

  const saveQuiet = useCallback(async () => {
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
    clearFieldError(key, setErrors); // ← remplace setErrors((prev) => ({ ...prev, [key]: undefined }))

    // Cas spécial gestité/parité/avortement :
    // quand l'utilisateur corrige gestite, on efface aussi les erreurs croisées
    // sur parite et avortement qui pourraient être devenues obsolètes
    if (key === "gestite") {
      clearFieldError("parite", setErrors);
      clearFieldError("avortement", setErrors);
    }
    if (key === "parite") {
      clearFieldError("avortement", setErrors);
    }
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
      const payload = formatGynecoForApi(form);
      const isNewRecord = !isExisting;
      if (isExisting) {
        await updateGyneco(numero, payload);
      } else {
        await createGyneco(numero, payload);
        setIsExisting(true);
      }
      setSavedForm(form);
      setIsEditing(false);
      toast.success(isNewRecord ? "Antécédent gynécologique créé." : "Antécédent gynécologique enregistré.");
    } catch (err) {
      // Erreurs de validation champ-par-champ → FieldError (pas de toast)
      // Les erreurs croisées gestite/parite/avortement remontent sur leur champ respectif
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
    handleChange,
    startEditing,
    cancelEditing,
    save,
  };
}