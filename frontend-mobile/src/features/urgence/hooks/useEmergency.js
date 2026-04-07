import { useState, useEffect } from "react";
import { getEmergencyContacts } from "../../../api/emergency.api";

export const useEmergency = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getEmergencyContacts();
      setContacts(response.data);
    } catch (err) {
      setError("Impossible de charger les contacts d'urgence.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return { contacts, loading, error, refetch: fetchContacts };
};