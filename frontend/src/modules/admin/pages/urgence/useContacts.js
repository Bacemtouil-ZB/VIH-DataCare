import { useState, useEffect, useCallback } from "react";
import {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from "../../services/EmergencyService";
import { toast } from "react-toastify";

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [error,    setError]    = useState(null);

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

  const ajouter = async (form) => {
    setSaving(true);
    try {
      const res = await createEmergencyContact(form);
      setContacts((prev) => [res.data, ...prev]);
      toast.success("Contact ajouté avec succès.");
      return true;
    } catch {
      toast.error("Erreur lors de l'ajout.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const modifier = async (id, form) => {
    setSaving(true);
    try {
      const res = await updateEmergencyContact(id, form);
      setContacts((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      toast.success("Contact modifié avec succès.");
      return true;
    } catch {
      toast.error("Erreur lors de la modification.");
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
      toast.success("Contact supprimé.");
      return true;
    } catch {
      toast.error("Erreur lors de la suppression.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  return { contacts, loading, saving, error, ajouter, modifier, supprimer };
};

export default useContacts;