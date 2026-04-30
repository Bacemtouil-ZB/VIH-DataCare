import { useState, useMemo } from "react";

// ── Segments ──────────────────────────────────────────────────
export const SEGMENTS = [
  { key: "tous",         label: "Tous"          }, // rollup
  { key: "decesSida",    label: "Décès SIDA"    },
  { key: "decesNormaux", label: "Décès normaux"  },
  { key: "perdusDeVue",  label: "Perdus de vue"  },
  { key: "transferts",   label: "Transferts"     },
  { key: "migrants",     label: "Migrants"        },
];

// Couleur par série dans la vue rollup
export const ROLLUP_COLORS = {
  decesSida:    "#ff4d4f",
  decesNormaux: "#8c8c8c",
  perdusDeVue:  "#ff7a45",
  transferts:   "#1890ff",
  migrants:     "#722ed1",
};

// ── Helper — merge tous les datasets par tranche pour rollup ──
// Retourne [{ tranche, decesSida, decesNormaux, perdusDeVue, transferts, migrants }]
const toRollupData = (dataMap, tranches) => {
  const map = {};
  for (const t of tranches) {
    map[t] = {
      tranche:      t,
      decesSida:    0,
      decesNormaux: 0,
      perdusDeVue:  0,
      transferts:   0,
      migrants:     0,
    };
  }
  for (const [key, rows] of Object.entries(dataMap)) {
    for (const row of rows) {
      if (!map[row.tranche]) continue;
      map[row.tranche][key] += row.total ?? 0;
    }
  }
  return tranches.map((t) => map[t]);
};

const TRANCHES_3 = ["<5ans", "5-14ans", ">15ans"];

// ── Hook ─────────────────────────────────────────────────────
const usePassageStades = ({ decesSida, decesNormaux, perdusDeVue, transferts, migrants }) => {

  const [activeSegment, setActiveSegment] = useState("tous");
  const [drawer, setDrawer] = useState({ open: false, tranche: null, row: null });

  const dataMap = useMemo(() => ({
    decesSida:    decesSida    ?? [],
    decesNormaux: decesNormaux ?? [],
    perdusDeVue:  perdusDeVue  ?? [],
    transferts:   transferts   ?? [],
    migrants:     migrants     ?? [],
  }), [decesSida, decesNormaux, perdusDeVue, transferts, migrants]);

  // Vue rollup — toutes les séries par tranche
  const rollupData = useMemo(
    () => toRollupData(dataMap, TRANCHES_3),
    [dataMap]
  );

  // Vue drilldown — une série par genre
  const drilldownData = useMemo(
    () => dataMap[activeSegment] ?? [],
    [dataMap, activeSegment]
  );

  const isRollup = activeSegment === "tous";

  // Données actives selon le mode
  const activeData = isRollup ? rollupData : drilldownData;

  // Clic sur un point → Drawer
  const handlePointClick = (chartPayload) => {
    if (!chartPayload?.activePayload?.length) return;
    const tranche = chartPayload.activeLabel;
    const row     = (isRollup ? rollupData : drilldownData).find((r) => r.tranche === tranche);
    if (!row) return;
    setDrawer({ open: true, tranche, row });
  };

  const closeDrawer = () => setDrawer({ open: false, tranche: null, row: null });

  return {
    activeSegment,
    setActiveSegment,
    activeData,
    isRollup,
    drawer,
    handlePointClick,
    closeDrawer,
  };
};

export default usePassageStades;