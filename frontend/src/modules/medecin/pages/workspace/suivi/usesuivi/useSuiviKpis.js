
import { useState, useEffect } from "react";
import { getKpisSuivi } from "../../../../services/suiviBiologiqueService";

const INITIAL_STATE = {
  cd4:        null,
  cv:         null,
  creatinine: null,  
  statut:     null,
  alertes:    [],
};

const useSuiviKpis = (patientId) => {
  const [kpis,    setKpis]    = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchKpis = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getKpisSuivi(patientId);
        if (res.success) {
          setKpis(res.data);
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des KPIs");
      } finally {
        setLoading(false);
      }
    };

    fetchKpis();
  }, [patientId]);

  return { kpis, loading, error };
};

export default useSuiviKpis;