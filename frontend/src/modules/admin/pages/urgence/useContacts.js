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
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    charger();
  }, [charger]);

  const resetErrors = () => setErrors({});

  const makeFieldHandler = (fieldName, setForm) => (e) => {
    setForm((prev) => ({ ...prev, [fieldName]: e.target.value }));
    clearFieldError(fieldName, setErrors);
    clearFieldError("_form", setErrors);
  };

  const validerFrontend = (form) => {
    const fieldErrors = {};

    if (!form.nom?.trim()) {
      fieldErrors.nom = "Le nom est obligatoire";
    } else if (form.nom.trim().length < 2) {
      fieldErrors.nom = "Le nom doit contenir au moins 2 caracteres";
    } else if (form.nom.trim().length > 200) {
      fieldErrors.nom = "Le nom ne peut pas depasser 200 caracteres";
    }

    const phoneRegex = /^\+?[\d\s\-().]{6,20}$/;

    if (!form.telephone?.trim()) {
      fieldErrors.telephone = "Le numero de telephone est obligatoire";
    } else if (!phoneRegex.test(form.telephone.trim())) {
      fieldErrors.telephone = "Numero de telephone invalide (ex: +216 XX XXX XXX)";
    }

    if (form.whatsapp?.trim() && !phoneRegex.test(form.whatsapp.trim())) {
      fieldErrors.whatsapp = "Numero WhatsApp invalide (ex: +216 XX XXX XXX)";
    }

    if (form.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      fieldErrors.email = "Adresse email invalide";
    }

    if (form.description?.trim().length > 500) {
      fieldErrors.description = "Description trop longue (max 500 caracteres)";
    }

    return fieldErrors;
  };

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
      toast.success("Contact ajoute avec succes.");
      return true;
    } catch (e) {
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
        return false;
      }

      if (e?.message) {
        setErrors({ _form: e.message });
        return false;
      }

      alertError("Erreur lors de l'ajout.");
      return false;
    } finally {
      setSaving(false);
    }
  };

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
      const updatedContact = res.data?.updatedContact || res.data;
      setContacts((prev) => prev.map((c) => (c.id === id ? updatedContact : c)));
      toast.success("Contact modifie avec succes.");
      return true;
    } catch (e) {
      if (e?.errors && Array.isArray(e.errors)) {
        const errorObj = {};
        e.errors.forEach((err) => {
          errorObj[err.field] = err.message;
        });
        setErrors(errorObj);
        return false;
      }

      if (e?.message) {
        setErrors({ _form: e.message });
        return false;
      }

      alertError("Erreur lors de la modification.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const supprimer = async (id) => {
    setSaving(true);
    try {
      await deleteEmergencyContact(id);
      setContacts((prev) => prev.filter((c) => c.id !== id));
      toast.success("Contact supprime.");
      return true;
    } catch {
      alertError("Erreur lors de la suppression.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return {
    contacts,
    loading,
    saving,
    error,
    errors,
    resetErrors,
    makeFieldHandler,
    ajouter,
    modifier,
    supprimer,
  };
};

export default useContacts;
