// ============================================================
//  GraphiqueCV.jsx — Ligne unique + label au point de changement
//  Axe Y logarithmique
// ============================================================

import { Card, Spin, Empty } from "antd";
import { useMemo } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, LabelList,
} from "recharts";
import {
  LIGNES_REF_CV,
  CONFIG_GRAPHIQUE,
  MESSAGES_VIDES,
  SEUILS_CV,
} from "../../constants/suiviConstants";
import { formatTooltipCV, formatDate } from "../../helpers/suiviHelpers";

// ── Tooltip ───────────────────────────────────────────────────
const TooltipCV = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  return (
    <div style={{
      background: "#fff",
      border: "1px solid #E8E8E8",
      borderRadius: 8,
      padding: "10px 14px",
      fontSize: 13,
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      minWidth: 190,
    }}>
      <div style={{
        fontWeight: 600, marginBottom: 8, color: "#333",
        borderBottom: "1px solid #F0F0F0", paddingBottom: 6,
      }}>
        {formatDate(point?.date)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <span style={{ color: "#888" }}>Charge virale</span>
        <span style={{ color: CONFIG_GRAPHIQUE.couleur_cv, fontWeight: 600 }}>
          {formatTooltipCV(point?.charge_virale_valeur)}
        </span>
      </div>
      {point?.traitement && (
        <div style={{
          marginTop: 8, paddingTop: 6,
          borderTop: "1px solid #F0F0F0",
          fontSize: 11, color: "#555",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>💊</span>
          <span style={{ fontWeight: 500 }}>{point.traitement}</span>
        </div>
      )}
      {point?.type_bilan && (
        <div style={{ fontSize: 11, color: "#AAA", marginTop: 2 }}>
          Bilan {point.type_bilan}
        </div>
      )}
    </div>
  );
};

// ── Tick axe X date complète ──────────────────────────────────
const TickX = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  return (
    <text x={x} y={y + 14} textAnchor="middle" fontSize={11} fill="#AAA">
      {payload.value}
    </text>
  );
};

// ── Tick axe Y logarithmique ──────────────────────────────────
const TickY = ({ x, y, payload }) => {
  const v = payload?.value;
  if (!v) return null;
  let label;
  if (v >= 1_000_000) label = `${v / 1_000_000}M`;
  else if (v >= 1_000) label = `${v / 1_000}k`;
  else label = `${v}`;
  return (
    <text x={x - 4} y={y + 4} textAnchor="end" fontSize={11} fill="#AAA">
      {label}
    </text>
  );
};

// ── Label valeur au-dessus de chaque point ────────────────────
const LabelValeur = ({ x, y, value }) => {
  if (value == null) return null;
  const affiche = value < SEUILS_CV.INDETECTABLE ? "Indét." : value.toLocaleString("fr-FR");
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={10} fontWeight={600} fill="#555">
      {affiche}
    </text>
  );
};

// ── Label traitement au point de changement ───────────────────
const LabelTraitement = ({ x, y, value, index, data }) => {
  if (!value) return null;
  const estChangement =
    index === 0 || data[index - 1]?.traitement !== value;
  if (!estChangement) return null;

  const mots = value.split("/");
  const ligne1 = mots.slice(0, 2).join("/");
  const ligne2 = mots.slice(2).join("/");

  return (
    <g>
      {/* ligne verticale de séparation */}
      <line
        x1={x} y1={y - 8}
        x2={x} y2={y + 30}
        stroke="#CBD5E1"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
      {/* fond label */}
      <rect
        x={x - 28} y={y - 38}
        width={56} height={ligne2 ? 28 : 16}
        rx={4} fill="#F8FAFC"
        stroke="#CBD5E1" strokeWidth={0.8}
      />
      <text x={x} y={y - 26} textAnchor="middle" fontSize={9} fontWeight={600} fill="#1E40AF">
        {ligne1}
      </text>
      {ligne2 && (
        <text x={x} y={y - 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#1E40AF">
          {ligne2}
        </text>
      )}
    </g>
  );
};

// ── Composant principal ───────────────────────────────────────
const GraphiqueCV = ({ data = [], periodes = [], loading }) => {

  // Fusionner traitement dans chaque point
  const dataAvecTraitement = useMemo(() => {
    return data.map((p) => {
      const periode = periodes.find((pr) => {
        const debut = new Date(pr.date_debut);
        const fin   = pr.date_fin ? new Date(pr.date_fin) : new Date();
        const date  = new Date(p.date);
        return date >= debut && date <= fin;
      });
      return {
        ...p,
        dateAffichee: formatDate(p.date),
        traitement:   periode?.nom_medicament ?? periode?.code_medicament ?? null,
        // valeur log : remplacer 0 par 1 pour éviter log(0)
        valeurLog: p.charge_virale_valeur > 0 ? p.charge_virale_valeur : 1,
      };
    });
  }, [data, periodes]);

  if (loading) return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ textAlign: "center", padding: "40px 0" }}><Spin /></div>
    </Card>
  );

  if (!data || data.length === 0) return (
    <Card title="Évolution charge virale" style={{ marginBottom: 16 }}>
      <Empty description={MESSAGES_VIDES.graphique} />
    </Card>
  );

  // Ticks logarithmiques fixes
  const ticksLog = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];

  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cv,
          }} />
          <span>Évolution charge virale</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>copies/mL</span>
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={CONFIG_GRAPHIQUE.hauteur}>
        <ComposedChart
          data={dataAvecTraitement}
          margin={{ top: 50, right: 24, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />

          <XAxis
            dataKey="dateAffichee"
            tick={<TickX />}
            tickLine={false}
            axisLine={{ stroke: "#F0F0F0" }}
            height={30}
          />

          <YAxis
            scale="log"
            domain={[1, "auto"]}
            ticks={ticksLog}
            tick={<TickY />}
            tickLine={false}
            axisLine={false}
            width={52}
            allowDataOverflow
            label={{
              value: "Valeur (log)",
              angle: -90,
              position: "insideLeft",
              offset: 10,
              style: { fontSize: 10, fill: "#BBB" },
            }}
          />

          {/* ── Lignes de référence depuis constantes ── */}
          {LIGNES_REF_CV.map((ligne) => (
            <ReferenceLine
              key={ligne.valeur}
              y={ligne.valeur}
              stroke={ligne.couleur}
              strokeDasharray={ligne.dash}
              strokeWidth={1.5}
              label={{
                value:    ligne.label,
                position: "insideTopRight",
                fontSize: 11,
                fontWeight: 600,
                fill:     ligne.couleur,
              }}
            />
          ))}

          <Tooltip content={<TooltipCV />} />

          <Line
            type="monotone"
            dataKey="valeurLog"
            stroke={CONFIG_GRAPHIQUE.couleur_cv}
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  key={payload.date}
                  cx={cx} cy={cy} r={4}
                  fill="#fff"
                  stroke={CONFIG_GRAPHIQUE.couleur_cv}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          >
            {/* valeur au-dessus du point */}
            <LabelList
              dataKey="valeurLog"
              content={(props) => <LabelValeur {...props} />}
            />
            {/* label traitement au point de changement */}
            <LabelList
              dataKey="traitement"
              content={(props) => (
                <LabelTraitement {...props} data={dataAvecTraitement} />
              )}
            />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>

      {/* ── Légende traitements ── */}
      {periodes.length > 0 && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 16,
          marginTop: 12, paddingTop: 12,
          borderTop: "1px solid #F5F5F5",
        }}>
          {periodes.map((periode, i) => (
            <div key={periode.medicament_id ?? i}
              style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#1E40AF", flexShrink: 0,
              }} />
              <span style={{ fontSize: 12, color: "#555", fontWeight: 500 }}>
                {periode.nom_medicament ?? periode.code_medicament}
              </span>
              {!periode.date_fin && (
                <span style={{
                  fontSize: 10, color: "#fff",
                  background: "#2E7D32",
                  borderRadius: 4, padding: "1px 6px", fontWeight: 500,
                }}>
                  en cours
                </span>
              )}
              <span style={{ fontSize: 11, color: "#BBB" }}>
                {formatDate(periode.date_debut)}
                {periode.date_fin ? ` → ${formatDate(periode.date_fin)}` : " → aujourd'hui"}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default GraphiqueCV; 