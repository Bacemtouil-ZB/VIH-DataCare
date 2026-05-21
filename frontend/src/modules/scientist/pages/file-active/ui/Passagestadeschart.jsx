import { Card, Empty, Segmented } from "antd";
import { useCallback, useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, CartesianGrid, ResponsiveContainer,
} from "recharts";
import {
  DECES_COLORS,
  DIVERS_COLORS,
  GENDER_COLORS,
  RETENTION_COLORS,
} from "../constants/chartColors";

const SEGMENTS = [
  { key: "rollup",       label: "Tous" },
  { key: "decesSida",    label: "Deces SIDA" },
  { key: "decesNormaux", label: "Deces normaux" },
  { key: "perdusDeVue",  label: "Perdus de vue" },
  { key: "transferts",   label: "Transferts" },
  { key: "migrants",     label: "Migrants" },
];

const ROLLUP_COLORS = {
  decesSida:    DECES_COLORS.decede_sida,
  decesNormaux: DECES_COLORS.decede_normale,
  perdusDeVue:  RETENTION_COLORS.perdu_de_vue,
  transferts:   DIVERS_COLORS.transferts,
  migrants:     DIVERS_COLORS.migrants,
};

const getTrancheKey = (row) => row?.tranche ?? row?.tranche_age ?? row?.label ?? null;

const sumGender = (row) => {
  if (!row) return 0;
  if (typeof row.total === "number") return row.total;
  return (row.homme ?? 0) + (row.femme ?? 0) + (row.transgenre ?? 0);
};

const indexByTranche = (rows = []) => {
  const map = new Map();
  rows.forEach((row) => {
    const tranche = getTrancheKey(row);
    if (!tranche) return;
    map.set(tranche, { tranche, ...row });
  });
  return map;
};

const collectTranches = (datasets = []) => {
  const seen = new Set();
  const list = [];
  datasets.forEach((rows) => {
    (rows ?? []).forEach((row) => {
      const tranche = getTrancheKey(row);
      if (!tranche || seen.has(tranche)) return;
      seen.add(tranche);
      list.push(tranche);
    });
  });
  return list;
};

const usePassageStades = ({ decesSida, decesNormaux, perdusDeVue, transferts, migrants }) => {
  const [activeSegment, setActiveSegment] = useState("rollup");

  const dataBySegment = useMemo(() => ({
    decesSida:    decesSida ?? [],
    decesNormaux: decesNormaux ?? [],
    perdusDeVue:  perdusDeVue ?? [],
    transferts:   transferts ?? [],
    migrants:     migrants ?? [],
  }), [decesSida, decesNormaux, perdusDeVue, transferts, migrants]);

  const segmentMaps = useMemo(() => ({
    decesSida:    indexByTranche(dataBySegment.decesSida),
    decesNormaux: indexByTranche(dataBySegment.decesNormaux),
    perdusDeVue:  indexByTranche(dataBySegment.perdusDeVue),
    transferts:   indexByTranche(dataBySegment.transferts),
    migrants:     indexByTranche(dataBySegment.migrants),
  }), [dataBySegment]);

  const tranches = useMemo(() => (
    collectTranches([
      dataBySegment.decesSida,
      dataBySegment.decesNormaux,
      dataBySegment.perdusDeVue,
      dataBySegment.transferts,
      dataBySegment.migrants,
    ])
  ), [dataBySegment]);

  const rollupData = useMemo(() => (
    tranches.map((tranche) => ({
      tranche,
      decesSida:    sumGender(segmentMaps.decesSida.get(tranche)),
      decesNormaux: sumGender(segmentMaps.decesNormaux.get(tranche)),
      perdusDeVue:  sumGender(segmentMaps.perdusDeVue.get(tranche)),
      transferts:   sumGender(segmentMaps.transferts.get(tranche)),
      migrants:     sumGender(segmentMaps.migrants.get(tranche)),
    }))
  ), [segmentMaps, tranches]);

  const isRollup = activeSegment === "rollup";

  const activeData = useMemo(() => {
    if (isRollup) return rollupData;
    const rows = dataBySegment[activeSegment] ?? [];
    return rows
      .map((row) => {
        const tranche = getTrancheKey(row);
        if (!tranche) return null;
        return {
          tranche,
          homme: row.homme ?? 0,
          femme: row.femme ?? 0,
          transgenre: row.transgenre ?? 0,
          total: sumGender(row),
        };
      })
      .filter(Boolean);
  }, [activeSegment, dataBySegment, isRollup, rollupData]);

  const setSegment = useCallback((next) => {
    setActiveSegment(next);
  }, []);

  return {
    activeSegment,
    setActiveSegment: setSegment,
    activeData,
    isRollup,
  };
};

// ── Tooltip ───────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #f0f0f0",
      borderRadius: 6,
      padding: "8px 12px",
      fontSize: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ margin: "2px 0", color: p.color }}>
          {p.name} : <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
};

// ── Colonnes Drawer rollup ────────────────────────────────────
// ── Composant ─────────────────────────────────────────────────
const PassageStadesChart = ({
  decesSida, decesNormaux, perdusDeVue, transferts, migrants, loading,
}) => {
  const {
    activeSegment,
    setActiveSegment,
    activeData,
    isRollup,
  } = usePassageStades({ decesSida, decesNormaux, perdusDeVue, transferts, migrants });

  return (
    <>
      <Card
        title="Passage des stades"
        size="small"
        loading={loading}
        style={{ height: "100%" }}
        bodyStyle={{ height: "calc(100% - 46px)" }}
        extra={
          <Segmented
            size="small"
            options={SEGMENTS.map((s) => ({ label: s.label, value: s.key }))}
            value={activeSegment}
            onChange={setActiveSegment}
          />
        }
      >
        {!activeData?.length
          ? <Empty description="Aucune donnée" />
          : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={activeData}
                margin={{ top: 8, right: 16, bottom: 24, left: 16 }}
                barCategoryGap="15%"
                barGap={3}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis
                  dataKey="tranche"
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  label={{
                    value: "Nombre des patients",
                    angle: -90,
                    position: "insideLeft",
                    offset: 20,
                    fontSize: 11,
                  }}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />

                {/* ── ROLLUP — une barre par indicateur ── */}
                {isRollup && Object.entries(ROLLUP_COLORS).map(([key, color]) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    name={SEGMENTS.find((s) => s.key === key)?.label}
                    fill={color}
                    radius={[3, 3, 0, 0]}
                    maxBarSize={48}
                  />
                ))}

                {/* ── DRILLDOWN — une barre par genre ── */}
                {!isRollup && (
                  <>
                    <Bar
                      dataKey="homme"
                      name="Hommes"
                      fill={GENDER_COLORS.homme}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={48}
                    />
                    <Bar
                      dataKey="femme"
                      name="Femmes"
                      fill={GENDER_COLORS.femme}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={48}
                    />
                    <Bar
                      dataKey="transgenre"
                      name="Transgenres"
                      fill={GENDER_COLORS.transgenre}
                      radius={[3, 3, 0, 0]}
                      maxBarSize={48}
                    />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          )
        }
      </Card>
    </>
  );
};

export default PassageStadesChart;