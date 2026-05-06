// ============================================================
//  useSuiviTableau.js
//  Hook Zone 3 — Tableau chronologique
//  Fetch : toutes les entrées biologiques du patient
// ============================================================

import { useState, useEffect } from "react";
import { getTableauSuivi } from "../../../../services/suiviBiologiqueService";

const useSuiviTableau = (patientId) => {
  const [tableau,  setTableau]  = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchTableau = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getTableauSuivi(patientId);
        // res = { success, count, data: [...] }
        if (res.success) {
          setTableau(res.data);
        }
      } catch (err) {
        setError(err.message || "Erreur lors du chargement du tableau");
      } finally {
        setLoading(false);
      }
    };

    fetchTableau();
  }, [patientId]);

  return { tableau, loading, error };
};

export default useSuiviTableau;