// ============================================================
//  useSuiviGraphiques.js
//  Hook Zone 2 — Graphiques CD4 + CV + périodes ARV
//  3 appels API en parallèle avec Promise.all
// ============================================================

import { useState, useEffect } from "react";
import {
  getGraphiqueCD4,
  getGraphiqueCV,
  getPeriodesARV,
} from "../../../../services/suiviBiologiqueService";
import {
  prepareDataCD4,
  prepareDataCV,
} from "../helpers/suiviHelpers";

const INITIAL_STATE = {
  cd4:     [],   // points courbe CD4
  cv:      [],   // points courbe CV
  periodes: [],  // zones ARV colorées
};

const useSuiviGraphiques = (patientId) => {
  const [graphiques, setGraphiques] = useState(INITIAL_STATE);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!patientId) return;

    const fetchGraphiques = async () => {
      setLoading(true);
      setError(null);
      try {
        // 3 appels en parallèle → performance optimale
        const [resCD4, resCV, resPeriodes] = await Promise.all([
          getGraphiqueCD4(patientId),
          getGraphiqueCV(patientId),
          getPeriodesARV(patientId),
        ]);

        setGraphiques({
          // prepareDataCD4/CV ajoute dateFormatee pour axe X Recharts
          cd4:      resCD4.success     ? prepareDataCD4(resCD4.data)     : [],
          cv:       resCV.success      ? prepareDataCV(resCV.data)       : [],
          periodes: resPeriodes.success ? resPeriodes.data               : [],
        });
      } catch (err) {
        setError(err.message || "Erreur lors du chargement des graphiques");
      } finally {
        setLoading(false);
      }
    };

    fetchGraphiques();
  }, [patientId]);

  return { graphiques, loading, error };
};

export default useSuiviGraphiques;