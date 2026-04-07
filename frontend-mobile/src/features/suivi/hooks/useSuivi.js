// ============================================================
//  useSuivi.js — sécurisé contre les réponses undefined
// ============================================================

import { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import {
  getGraphiqueCD4,
  getGraphiqueCV,
  getPeriodesARV,
} from "../../../api/suivi.api";

// ── Helpers ───────────────────────────────────────────────────
const formatDateAxe = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
};

export const prepareDataCD4 = (points) => {
  if (!Array.isArray(points)) return [];
  return points.map((p) => ({
    ...p,
    date:         p.date,
    dateFormatee: formatDateAxe(p.date),
    x:            new Date(p.date).getTime(),
    y:            p.cd4_absolu,
  }));
};

export const prepareDataCV = (points) => {
  if (!Array.isArray(points)) return [];
  return points.map((p) => ({
    ...p,
    date:         p.date,
    dateFormatee: formatDateAxe(p.date),
    x:            new Date(p.date).getTime(),
    y:            p.charge_virale_valeur,
    yLog:         p.charge_virale_valeur > 0 ? p.charge_virale_valeur : 1,
  }));
};

// ── État initial ──────────────────────────────────────────────
const INITIAL_STATE = {
  cd4:     [],
  cv:      [],
  periodes: [],
};

// ── Hook ──────────────────────────────────────────────────────
const useSuivi = () => {
  const numero = useAuthStore((state) => state.user?.numero);
  const [graphiques, setGraphiques] = useState(INITIAL_STATE);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    if (!numero) return;

    const fetchGraphiques = async () => {
      setLoading(true);
      setError(null);
      try {
        const [resCD4, resCV, resPeriodes] = await Promise.all([
          getGraphiqueCD4(numero),
          getGraphiqueCV(numero),
          getPeriodesARV(numero),
        ]);


        setGraphiques({
          cd4:     prepareDataCD4(resCD4?.data),
          cv:      prepareDataCV(resCV?.data),
          periodes: Array.isArray(resPeriodes?.data) ? resPeriodes.data : [],
        });
      } catch (err) {
        console.log("useSuivi ERROR:", err.message, err.stack);
        setError(err.message || "Erreur lors du chargement des graphiques");
        setGraphiques(INITIAL_STATE);
      } finally {
        setLoading(false);
      }
    };

    fetchGraphiques();
  }, [numero]);

  return { graphiques, loading, error };
};

export default useSuivi;