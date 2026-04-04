import { Card, Spin, Empty } from "antd";
import { useMemo } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ResponsiveContainer, LabelList,
} from "recharts";
import {
  LIGNES_REF_CD4,
  CONFIG_GRAPHIQUE,
  MESSAGES_VIDES,
} from "../../constants/suiviConstants";
import { formatTooltipCD4, formatDate } from "../../helpers/suiviHelpers";

const SEUIL_CRITIQUE  = 200;
const SEUIL_OBJECTIF  = 500;
const COULEUR_OK      = "#22C55E";
const COULEUR_CRIT    = "#EF4444";
const COULEUR_OBJ     = "#F59E0B";

// ── Tooltip ───────────────────────────────────────────────────
const TooltipCD4 = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point   = payload[0]?.payload;
  const estCrit = (point?.cd4_absolu ?? Infinity) < SEUIL_CRITIQUE;

  return (
    <div style={{
      background:   "#1E293B",
      border:       "1px solid #334155",
      borderRadius: 8,
      padding:      "10px 14px",
      fontSize:     13,
      boxShadow:    "0 4px 20px rgba(0,0,0,0.4)",
      minWidth:     200,
    }}>
      <div style={{
        fontWeight: 600, marginBottom: 8, color: "#F1F5F9",
        borderBottom: "1px solid #334155", paddingBottom: 6,
      }}>
        {formatDate(point?.date)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <span style={{ color: "#94A3B8" }}>CD4</span>
        <span style={{ color: estCrit ? COULEUR_CRIT : COULEUR_OK, fontWeight: 700 }}>
          {formatTooltipCD4(point?.cd4_absolu)} cell/mm³
        </span>
      </div>

      {point?.cd4_pourcent && (
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
          <span style={{ color: "#94A3B8" }}>Pourcentage</span>
          <span style={{ color: "#CBD5E1", fontWeight: 500 }}>{point.cd4_pourcent} %</span>
        </div>
      )}

      <div style={{
        marginTop: 8, paddingTop: 6,
        borderTop: "1px solid #334155",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: estCrit ? COULEUR_CRIT : COULEUR_OK,
        }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: estCrit ? COULEUR_CRIT : COULEUR_OK }}>
          {estCrit ? "Zone critique" : "Normal"}
        </span>
      </div>

      {point?.traitement && (
        <div style={{
          marginTop: 8, paddingTop: 6,
          borderTop: "1px solid #334155",
          fontSize: 11, color: "#94A3B8",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span>💊</span>
          <span style={{ fontWeight: 500, color: "#CBD5E1" }}>{point.traitement}</span>
        </div>
      )}

      {point?.type_bilan && (
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
          Bilan {point.type_bilan}
        </div>
      )}
    </div>
  );
};

// ── Label valeur alternée ─────────────────────────────────────
const LabelValeur = ({ x, y, value, index }) => {
  if (value == null) return null;
  const estCrit  = value < SEUIL_CRITIQUE;
  const decalage = index % 2 === 0 ? -14 : 18;
  return (
    <text
      x={x} y={y + decalage}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
      fill={estCrit ? COULEUR_CRIT : COULEUR_OK}
    >
      {value.toLocaleString("fr-FR")}
    </text>
  );
};

// ── Dot coloré ───────────────────────────────────────────────
const DotCD4 = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  const estCrit = (payload?.cd4_absolu ?? Infinity) < SEUIL_CRITIQUE;
  return (
    <circle
      key={`dot-${payload.date}`}
      cx={cx} cy={cy} r={4.5}
      fill="#0F172A"
      stroke={estCrit ? COULEUR_CRIT : COULEUR_OK}
      strokeWidth={2.5}
    />
  );
};

// ── Segments colorés ──────────────────────────────────────────
const LigneCD4 = ({ points, data }) => {
  if (!points || points.length < 2) return null;
  return (
    <g>
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        if (!p1 || !p2 || p1.x == null || p2.x == null) return null;
        const v1   = data[i]?.cd4_absolu;
        const v2   = data[i + 1]?.cd4_absolu;
        if (v1 == null || v2 == null) return null;
        const crit = v1 < SEUIL_CRITIQUE || v2 < SEUIL_CRITIQUE;
        return (
          <line
            key={`seg-${i}`}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            stroke={crit ? COULEUR_CRIT : COULEUR_OK}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
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
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Titre */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cd4, flexShrink: 0,
          }} />
          <span>Évolution CD4</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>cell/mm³</span>

          {/* Séparateur */}
          <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />

          {/* Badges légende */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

            {/* Normal */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEUR_OK, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>Normal</span>
            </div>

            {/* Critique */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEUR_CRIT, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Critique
                <span style={{ color: "#AAA", fontWeight: 400 }}> (&lt;{SEUIL_CRITIQUE})</span>
              </span>
            </div>

            {/* Objectif */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 20, height: 3,
                background: `repeating-linear-gradient(90deg, ${COULEUR_OBJ} 0px, ${COULEUR_OBJ} 4px, transparent 4px, transparent 7px)`,
                borderRadius: 2,
              }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Objectif
                <span style={{ color: "#AAA", fontWeight: 400 }}> (≥{SEUIL_OBJECTIF})</span>
              </span>
            </div>

          </div>
        </div>
      }
    >
      {/* Zone graphique avec fond sombre */}
      <div style={{
        background:   "#0F172A",
        borderRadius: 10,
        padding:      "16px 12px 12px 4px",
        overflow:     "hidden",
      }}>
        <ResponsiveContainer width="100%" height={CONFIG_GRAPHIQUE.hauteur ?? 300}>
          <LineChart
            data={dataAvecTraitement}
            margin={{ top: 22, right: 28, left: 0, bottom: 4 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1E293B"
              vertical={false}
            />

            <XAxis
              dataKey="dateAffichee"
              stroke="#475569"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155" }}
              height={32}
            />

            <YAxis
              width={52}
              stroke="#475569"
              tick={{ fontSize: 11, fill: "#94A3B8" }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              domain={[0, "auto"]}
              tickFormatter={(v) => v.toLocaleString("fr-FR")}
            />

            <Tooltip
              cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 2" }}
              content={<TooltipCD4 />}
            />

            {/* Lignes de référence sans label — titre dans le header */}
            {LIGNES_REF_CD4.map((ligne) => (
              <ReferenceLine
                key={ligne.valeur}
                y={ligne.valeur}
                stroke={ligne.couleur}
                strokeDasharray="6 3"
                strokeWidth={1.5}
              />
            ))}

            {/* Ligne principale multicolore */}
            <Line
              type="monotone"
              dataKey="cd4_absolu"
              stroke="transparent"
              strokeWidth={0}
              dot={<DotCD4 />}
              activeDot={{
                r: 6,
                fill: "#0F172A",
                stroke: "#94A3B8",
                strokeWidth: 2,
              }}
              connectNulls={false}
              shape={(props) => (
                <LigneCD4 points={props.points} data={dataAvecTraitement} />
              )}
            >
              <LabelList
                dataKey="cd4_absolu"
                content={<LabelValeur />}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GraphiqueCD4;