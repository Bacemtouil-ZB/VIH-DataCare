import { useState, useEffect, useMemo, useCallback } from "react";
import { getNouveauxMaladesSummary,
         getAnneesDisponibles,
         refreshBiMVs }                              from "../../../services/biService.js";
import { toCasSexeAgeChartData,
         toKpiData }                                 from "../helpers/formatCasSexeAge";
import { toDiagnosticTardifChartData }               from "../helpers/formatDiagnostic";
import { toPopulationsClesChartData }                from "../helpers/formatPopCles";

const useNouveauxMaladesDashboard = () => {

  // ── Filtres ──────────────────────────────────────────────
  const [annees,    setAnnees]    = useState([]);
  const [annee,     setAnnee]     = useState(null);
  const [trimestre, setTrimestre] = useState(null);

  // ── États API ────────────────────────────────────────────
  const [rawData,    setRawData]    = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  // ── États Refresh ────────────────────────────────────────
  const [refreshing,     setRefreshing]     = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  // ── Charger années disponibles au montage ────────────────
  useEffect(() => {
    getAnneesDisponibles().then((res) => {
      const liste = res.data ?? [];
      setAnnees(liste);
      setAnnee(liste[0] ?? null);
    });
  }, []);

  // ── Fetch données ────────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!annee) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getNouveauxMaladesSummary({ annee, trimestre })
      .then((res) => { if (!cancelled) setRawData(res.data); })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [annee, trimestre]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Refresh manuel ───────────────────────────────────────
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await refreshBiMVs();
      setLastRefreshedAt(res.data.refreshedAt);
      await fetchData();                          // recharge les données après refresh
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  // ── Transformation → Recharts ────────────────────────────
  const chartData = useMemo(() => {
    if (!rawData) return null;
    return {
      kpis:             toKpiData(rawData.casSexeAge),
      casSexeAge:       toCasSexeAgeChartData(rawData.casSexeAge),
      diagnosticTardif: toDiagnosticTardifChartData(rawData.diagnosticTardif),
      populationsCles:  toPopulationsClesChartData(rawData.populationsCles),
    };
  }, [rawData]);

  return {
    annees,
    annee,     setAnnee,
    trimestre, setTrimestre,
    chartData,
    loading,
    error,
    refreshing,
    lastRefreshedAt,
    handleRefresh,
  };
};

export default useNouveauxMaladesDashboard;