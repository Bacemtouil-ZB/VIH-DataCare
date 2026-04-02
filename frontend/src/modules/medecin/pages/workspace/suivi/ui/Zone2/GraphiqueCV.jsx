// ============================================================
//  GraphiqueCV.jsx
//  Zone 2 — Courbe Charge Virale + zones ARV + seuil
//  Reçoit: data=[] periodes=[] loading=boolean
// ============================================================

import { Card, Spin, Empty, Typography } from "antd";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from "recharts";
import {
  LIGNES_REF_CV,
  CONFIG_GRAPHIQUE,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";
import {
  getCouleurARV,
  formatTooltipCV,
  formatDateRecharts,
} from "../../helpers/suiviHelpers";

const { Text } = Typography;

// ── Tooltip personnalisé ─────────────────────────────────────
const TooltipCV = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-secondary)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
      }}
    >
      <div style={{ fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{ color: CONFIG_GRAPHIQUE.couleur_cv }}>
        CV : {formatTooltipCV(point?.charge_virale_valeur)}
      </div>
      {point?.traitement && (
        <div style={{ color: "var(--color-text-tertiary)", fontSize: 11, marginTop: 4 }}>
          {point.traitement}
        </div>
      )}
    </div>
  );
};

// ── Composant principal ──────────────────────────────────────
const GraphiqueCV = ({ data = [], periodes = [], loading }) => {
  if (loading) {
    return (
      <Card style={{ marginBottom: 16 }}>
        <div style={{ textAlign: "center", padding: "40px 0" }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card title="Évolution charge virale" style={{ marginBottom: 16 }}>
        <Empty description={MESSAGES_VIDES.graphique} />
      </Card>
    );
  }

  const dernierDate = data[data.length - 1]?.dateFormatee;

  return (
    <Card
      title="Évolution charge virale"
      style={{ marginBottom: 16 }}
      extra={
        <Text type="secondary" style={{ fontSize: 12 }}>
          copies/mL
        </Text>
      }
    >
      <ResponsiveContainer width="100%" height={CONFIG_GRAPHIQUE.hauteur}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
        >
          {/* ── Zones ARV colorées ── */}
          {periodes.map((periode, index) => {
            const couleur = getCouleurARV(index);
            return (
              <ReferenceArea
                key={periode.medicament_id ?? index}
                x1={formatDateRecharts(periode.date_debut)}
                x2={
                  periode.date_fin
                    ? formatDateRecharts(periode.date_fin)
                    : dernierDate
                }
                fill={couleur.fill}
                fillOpacity={0.4}
                stroke={couleur.stroke}
                strokeOpacity={0.3}
              />
            );
          })}

          {/* ── Seuil détectable ── */}
          {LIGNES_REF_CV.map((ligne) => (
            <ReferenceLine
              key={ligne.valeur}
              y={ligne.valeur}
              stroke={ligne.couleur}
              strokeDasharray={ligne.dash}
              label={{
                value: ligne.label,
                position: "insideTopRight",
                fontSize: 11,
                fill: ligne.couleur,
              }}
            />
          ))}

          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CONFIG_GRAPHIQUE.couleur_grille}
            vertical={false}
          />

          <XAxis
            dataKey="dateFormatee"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />

          <YAxis
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            width={60}
            tickFormatter={(v) =>
              v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v
            }
          />

          <Tooltip content={<TooltipCV />} />

          <Line
            type="monotone"
            dataKey="charge_virale_valeur"
            stroke={CONFIG_GRAPHIQUE.couleur_cv}
            strokeWidth={CONFIG_GRAPHIQUE.epaisseur_courbe}
            dot={{ r: CONFIG_GRAPHIQUE.rayon_point, fill: CONFIG_GRAPHIQUE.couleur_cv }}
            activeDot={{ r: CONFIG_GRAPHIQUE.rayon_point_hover }}
            connectNulls={false}
          />
        </LineChart>
      </ResponsiveContainer>

      {/* ── Légende traitements (partagée avec CD4) ── */}
      {periodes.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
            paddingTop: 12,
            borderTop: "0.5px solid var(--color-border-tertiary)",
          }}
        >
          {periodes.map((periode, index) => {
            const couleur = getCouleurARV(index);
            return (
              <div
                key={periode.medicament_id ?? index}
                style={{ display: "flex", alignItems: "center", gap: 6 }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: couleur.fill,
                    border: `1px solid ${couleur.stroke}`,
                  }}
                />
                <span style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                  {periode.nom_medicament ?? periode.code_medicament}
                  {periode.en_cours && (
                    <span style={{ color: "var(--color-text-tertiary)" }}> (en cours)</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};

export default GraphiqueCV;