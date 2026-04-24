import { useState, useEffect } from "react";
import { getEmergencyContacts } from "../../../api/emergency.api";
import useI18n from "../../../i18n/useI18n";

export const useEmergency = () => {
  const { t } = useI18n();
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
      setError(err.response?.data?.message || t("urgence.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [t]);

  return { contacts, loading, error, refetch: fetchContacts };
};
