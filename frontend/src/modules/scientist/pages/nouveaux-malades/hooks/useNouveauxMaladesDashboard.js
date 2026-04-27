import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getNouveauxMaladesSummary,
  getAnneesDisponibles,
  refreshBiMVs,
} from "../../../services/biService.js";

// ─────────────────────────────────────────────────────────────
// Helper KPI — somme les totaux de chaque tranche de nouveaux_depistes
// nouveaux_depistes : [{ tranche, homme, femme, transgenre, total }]
// ─────────────────────────────────────────────────────────────
const toKpiData = (nouveauxDepistes = []) => ({
  total:      nouveauxDepistes.reduce((s, r) => s + (r.total      ?? 0), 0),
  homme:      nouveauxDepistes.reduce((s, r) => s + (r.homme      ?? 0), 0),
  femme:      nouveauxDepistes.reduce((s, r) => s + (r.femme      ?? 0), 0),
  transgenre: nouveauxDepistes.reduce((s, r) => s + (r.transgenre ?? 0), 0),
});

// ─────────────────────────────────────────────────────────────
// Helper Populations clés — Recharts PieChart + tableau drill-down
// donut : [{ label, value }]
// detail : { hsh, udi, ps, transgenres } — chacun [{ tranche, homme, femme, transgenre, total }]
// ─────────────────────────────────────────────────────────────
const POP_COLORS = {
  HSH:         "#1890ff",
  UDI:         "#faad14",
  PS:          "#13c2c2",
  Transgenres: "#722ed1",
};

const toPopulationsClesChartData = ({ donut = [], detail = {} } = {}) => ({
  pieData: donut.map((d) => ({
    name:  d.label,
    value: d.value,
    fill:  POP_COLORS[d.label] ?? "#d9d9d9",
  })),
  detail,   // hsh / udi / ps / transgenres — déjà formatés par le backend
});

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
  const [refreshing,      setRefreshing]      = useState(false);
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null);

  // ── Charger années disponibles au montage ────────────────
  // getAnneesDisponibles() → { success, data: [2025, 2024, ...] }
  useEffect(() => {
    getAnneesDisponibles()
      .then((res) => {
        const liste = res.data ?? [];   // tableau direct d'années
        setAnnees(liste);
        setAnnee(liste[0] ?? null);
      })
      .catch((err) => setError(err.message));
  }, []);

  // ── Fetch données ────────────────────────────────────────
  // getNouveauxMaladesSummary() → { success, data: { meta, nouveaux_depistes, diagnostic_tardif, populations_cles } }
  const fetchData = useCallback(async () => {
    if (!annee) return;
    let cancelled = false;

    setLoading(true);
    setError(null);

    getNouveauxMaladesSummary({ annee, trimestre })
      .then((res) => {
        if (!cancelled) setRawData(res.data); // res.data = { meta, nouveaux_depistes, ... }
      })
      .catch((err) => { if (!cancelled) setError(err.message); })
      .finally(()  => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [annee, trimestre]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ── Refresh manuel ───────────────────────────────────────
  // refreshBiMVs() → { success, data: { refreshed, timestamp } }
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const res = await refreshBiMVs();
      setLastRefreshedAt(res.data.timestamp);  // ← était refreshedAt, maintenant timestamp
      await fetchData();
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, [fetchData]);

  // ── Transformation → Recharts ────────────────────────────
  // Le backend retourne les données déjà formatées pour Recharts.
  // On ne fait que mapper vers les noms attendus par les composants.
  const chartData = useMemo(() => {
    if (!rawData) return null;

    const nouveaux    = rawData.nouveaux_depistes  ?? [];
    const diagnostic  = rawData.diagnostic_tardif  ?? [];
    const popCles     = rawData.populations_cles   ?? {};

    return {
      // KPI cards — calculés ici car le backend ne les expose pas en agrégat
      kpis: toKpiData(nouveaux),

      // Bar groupé gender × tranche_8
      // [{ tranche, homme, femme, transgenre, total }]
      casSexeAge: nouveaux,

      // Bar empilé CD4 — clés : lt200 / entre_200_350 / gt350
      // [{ tranche, lt200, entre_200_350, gt350 }]
      diagnosticTardif: diagnostic,

      // Donut + détail drill-down par groupe
      populationsCles: toPopulationsClesChartData(popCles),
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