import { useState, useEffect, useCallback } from "react";
import {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../../services/EmergencyService";
import { toast } from "react-toastify";
import { alertError } from "../../../../shared/utils/uiAlerts";
import { clearFieldError } from "../../../../shared/components/Forms/FieldLabel/clearFieldError";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);
  const [errors,   setErrors]   = useState({});          // ← erreurs par champ

  // ====== Chargement ======
  const charger = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getEmergencyContacts();
      setContacts(res.data ?? []);
    } catch {
      setError("Impossible de charger les contacts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { charger(); }, [charger]);

  // ====== Reset erreurs (ouverture / fermeture modal) ======
  const resetErrors = () => setErrors({});

  // ====== Handler onChange générique avec clearFieldError ======
  const makeFieldHandler = (fieldName, setForm) => (e) => {
    setForm((prev) => ({ ...prev, [fieldName]: e.target.value }));
    clearFieldError(fieldName, setErrors);
  };

  // ====== Validation frontend (miroir exact du backend) ======
  const validerFrontend = (form) => {
    const fieldErrors = {};

    if (!form.nom?.trim()) {
      fieldErrors.nom = "Le nom est obligatoire";
    } else if (form.nom.trim().length < 2) {
      fieldErrors.nom = "Le nom doit contenir au moins 2 caractères";
    } else if (form.nom.trim().length > 200) {
      fieldErrors.nom = "Le nom ne peut pas dépasser 200 caractères";
    }

    const phoneRegex = /^\+?[\d\s\-().]{6,20}$/;
    if (form.telephone?.trim() && !phoneRegex.test(form.telephone.trim())) {
      fieldErrors.telephone = "Numéro de téléphone invalide (ex: +216 XX XXX XXX)";
    }
    if (form.whatsapp?.trim() && !phoneRegex.test(form.whatsapp.trim())) {
      fieldErrors.whatsapp = "Numéro WhatsApp invalide (ex: +216 XX XXX XXX)";
    }
    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      fieldErrors.email = "Adresse email invalide";
    }
    if (form.description?.trim().length > 500) {
      fieldErrors.description = "Description trop longue (max 500 caractères)";
    }

    return fieldErrors;
  };

  // ====== Ajouter ======
  const ajouter = async (form) => {
    const fieldErrors = validerFrontend(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setSaving(true);
    setErrors({});
    try {
      const res = await createEmergencyContact(form);
      setContacts((prev) => [res.data, ...prev]);
      toast.success("Contact ajouté avec succès.");
      return true;
    } catch (e) {
      // Cas 1 — errors[] avec field (express-validator via handleValidation)
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => { errorObj[err.field] = err.message; });
        setErrors(errorObj);
        return false;
      }
      // Cas 2 — message simple (erreur métier serveur)
      if (e?.message) {
        setErrors({ _form: e.message });
        return false;
      }
      // Cas 3 — fallback inattendu (réseau, serveur indisponible)
      alertError("Erreur lors de l'ajout.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ====== Modifier ======
  const modifier = async (id, form) => {
    const fieldErrors = validerFrontend(form);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return false;
    }

    setSaving(true);
    setErrors({});
    try {
      const res = await updateEmergencyContact(id, form);
      setContacts((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      toast.success("Contact modifié avec succès.");
      return true;
    } catch (e) {
      // Cas 1 — errors[] avec field
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => { errorObj[err.field] = err.message; });
        setErrors(errorObj);
        return false;
      }
      // Cas 2 — message simple
      if (e?.message) {
        setErrors({ _form: e.message });
        return false;
      }
      // Cas 3 — fallback
      alertError("Erreur lors de la modification.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ====== Supprimer ======
  const supprimer = async (id) => {
    setSaving(true);
    try {
      await deleteEmergencyContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact supprimé.");
      return true;
    } catch {
      alertError("Erreur lors de la suppression.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    contacts, loading, saving, error,
    errors,          // ← exposé pour <FieldError />
    resetErrors,     // ← appelé à l'ouverture/fermeture modal
    makeFieldHandler,// ← factory onChange avec clearFieldError
    ajouter, modifier, supprimer,
  };
};

export default useContacts;