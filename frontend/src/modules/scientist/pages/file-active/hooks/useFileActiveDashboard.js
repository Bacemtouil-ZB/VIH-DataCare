import { useState, useEffect, useMemo } from "react";
import { getFileActiveSummary } from "../../../services/biService.js";

// ── Helper KPI — somme depuis total_file_active ──────────────
// [{ tranche, homme, femme, transgenre, total }]
const toKpiFileActive = (totalData = []) => ({
  total:      totalData.reduce((s, r) => s + (r.total      ?? 0), 0),
  homme:      totalData.reduce((s, r) => s + (r.homme      ?? 0), 0),
  femme:      totalData.reduce((s, r) => s + (r.femme      ?? 0), 0),
  transgenre: totalData.reduce((s, r) => s + (r.transgenre ?? 0), 0),
});

const useFileActiveDashboard = () => {

  const annee = new Date().getFullYear();

  const [rawData, setRawData] = useState(null);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    let cancelled = false;

    getFileActiveSummary({ annee })
      .then((res) => { if (!cancelled) setRawData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message); });

    return () => { cancelled = true; };
  }, [annee]);

  const loading = rawData === null && error === null;

  const chartData = useMemo(() => {
    if (!rawData) return null;
    return {
      annee,
      kpis:           toKpiFileActive(rawData.total_file_active ?? []),
      totalFileActive: rawData.total_file_active              ?? [],
      cvControle:      rawData.cv_controle?.data              ?? [],
      cvCible95:       rawData.cv_controle?.cible_95          ?? false,
      cascadeVirale:   rawData.cascade_virale                 ?? [],
      decesSida:       rawData.deces?.sida                    ?? [],
      decesNormaux:    rawData.deces?.normaux                 ?? [],
      retention:       rawData.retention                      ?? [],
      transferts:      rawData.transferts                     ?? [],
      migrants:        rawData.migrants                       ?? [],
    };
  }, [rawData]);

  return { annee, chartData, loading, error };
};

export default useFileActiveDashboard;