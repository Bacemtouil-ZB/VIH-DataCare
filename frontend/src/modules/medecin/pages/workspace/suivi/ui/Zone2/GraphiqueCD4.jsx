// ============================================================
//  GraphiqueCD4.jsx — Ligne unique + label au point de changement
//  Axe Y linéaire
// ============================================================

import { Card, Spin, Empty } from "antd";
import { useMemo } from "react";
import {
  ComposedChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, LabelList,
} from "recharts";
import {
  LIGNES_REF_CD4,
  CONFIG_GRAPHIQUE,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";
import { formatTooltipCD4, formatDate } from "../../helpers/suiviHelpers";

// ── Tooltip ───────────────────────────────────────────────────
const TooltipCD4 = ({ active, payload }) => {
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
        <span style={{ color: "#888" }}>CD4</span>
        <span style={{ color: CONFIG_GRAPHIQUE.couleur_cd4, fontWeight: 600 }}>
          {formatTooltipCD4(point?.cd4_absolu)}
        </span>
      </div>
      {point?.cd4_pourcent && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: "#888" }}>Pourcentage</span>
          <span style={{ color: "#555", fontWeight: 500 }}>{point.cd4_pourcent} %</span>
        </div>
      )}
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

// ── Label valeur au-dessus de chaque point ────────────────────
const LabelValeur = ({ x, y, value }) => {
  if (value == null) return null;
  return (
    <text x={x} y={y - 10} textAnchor="middle" fontSize={10} fontWeight={600} fill="#555">
      {value.toLocaleString("fr-FR")}
    </text>
  );
};

// ── Label traitement au point de changement ───────────────────
const LabelTraitement = ({ x, y, value, index, data }) => {
  if (!value) return null;
  const estChangement =
    index === 0 || data[index - 1]?.traitement !== value;
  if (!estChangement) return null;

  const mots  = value.split("/");
  const ligne1 = mots.slice(0, 2).join("/");
  const ligne2 = mots.slice(2).join("/");

  return (
    <g>
      <line
        x1={x} y1={y - 8}
        x2={x} y2={y + 30}
        stroke="#CBD5E1"
        strokeWidth={1}
        strokeDasharray="3 2"
      />
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
const GraphiqueCD4 = ({ data = [], periodes = [], loading }) => {

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
      };
    });
  }, [data, periodes]);

  if (loading) return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ textAlign: "center", padding: "40px 0" }}><Spin /></div>
    </Card>
  );

  if (!data || data.length === 0) return (
    <Card title="Évolution CD4" style={{ marginBottom: 16 }}>
      <Empty description={MESSAGES_VIDES.graphique} />
    </Card>
  );

  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cd4,
          }} />
          <span>Évolution CD4</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>cell/mm³</span>
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
            tick={{ fontSize: 11, fill: "#AAA" }}
            tickLine={false}
            axisLine={false}
            width={45}
            domain={[0, "auto"]}
          />

          {/* ── Lignes de référence depuis constantes ── */}
          {LIGNES_REF_CD4.map((ligne) => (
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

          <Tooltip content={<TooltipCD4 />} />

          <Line
            type="monotone"
            dataKey="cd4_absolu"
            stroke={CONFIG_GRAPHIQUE.couleur_cd4}
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              return (
                <circle
                  key={payload.date}
                  cx={cx} cy={cy} r={4}
                  fill="#fff"
                  stroke={CONFIG_GRAPHIQUE.couleur_cd4}
                  strokeWidth={2}
                />
              );
            }}
            activeDot={{ r: 6 }}
            connectNulls={false}
          >
            <LabelList
              dataKey="cd4_absolu"
              content={(props) => <LabelValeur {...props} />}
            />
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

export default GraphiqueCD4;