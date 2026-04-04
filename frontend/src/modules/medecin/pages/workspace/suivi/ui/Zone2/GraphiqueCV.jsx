// ============================================================
//  GraphiqueCV.jsx — Style sombre identique à GraphiqueCD4
//  - Fond sombre pour la zone graphique
//  - Ligne unique colorée (indétectable = vert, détectable = orange/rouge)
//  - Légende complète dans le header
//  - Dots colorés selon seuil
//  - Valeurs alternées haut/bas
//  - Axe Y logarithmique
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

const SEUIL_INDETECTABLE = SEUILS_CV?.INDETECTABLE ?? 50;
const SEUIL_ELEVE        = 1000;
const COULEUR_OK         = "#22C55E";   // vert  — indétectable
const COULEUR_MID        = "#F59E0B";   // ambre — détectable mais bas
const COULEUR_CRIT       = "#EF4444";   // rouge — charge élevée

const getCouleurCV = (valeur) => {
  if (valeur == null)             return COULEUR_OK;
  if (valeur < SEUIL_INDETECTABLE) return COULEUR_OK;
  if (valeur < SEUIL_ELEVE)        return COULEUR_MID;
  return COULEUR_CRIT;
};

// ── Tooltip sombre ────────────────────────────────────────────
const TooltipCV = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point   = payload[0]?.payload;
  const valeur  = point?.charge_virale_valeur;
  const couleur = getCouleurCV(valeur);

  const affiche =
    valeur == null          ? "—"
    : valeur < SEUIL_INDETECTABLE ? "Indétectable"
    : formatTooltipCV(valeur);

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
        <span style={{ color: "#94A3B8" }}>Charge virale</span>
        <span style={{ color: couleur, fontWeight: 700 }}>
          {affiche}{valeur >= SEUIL_INDETECTABLE && " copies/mL"}
        </span>
      </div>

      <div style={{
        marginTop: 8, paddingTop: 6,
        borderTop: "1px solid #334155",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: couleur,
        }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: couleur }}>
          {valeur == null            ? "—"
           : valeur < SEUIL_INDETECTABLE ? "Indétectable"
           : valeur < SEUIL_ELEVE        ? "Détectable"
           : "Charge élevée"}
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

// ── Tick axe X ────────────────────────────────────────────────
const TickX = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  return (
    <text x={x} y={y + 14} textAnchor="middle" fontSize={11} fill="#94A3B8">
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
    <text x={x - 4} y={y + 4} textAnchor="end" fontSize={11} fill="#94A3B8">
      {label}
    </text>
  );
};

// ── Label valeur alternée ─────────────────────────────────────
const LabelValeur = ({ x, y, index, data }) => {
  const valeurReelle = data?.[index]?.charge_virale_valeur;
  if (valeurReelle == null) return null;

  const couleur  = getCouleurCV(valeurReelle);
  const affiche  = valeurReelle < SEUIL_INDETECTABLE
    ? "Indét."
    : valeurReelle >= 1_000_000
      ? `${(valeurReelle / 1_000_000).toFixed(1)}M`
      : valeurReelle >= 1_000
        ? `${Math.round(valeurReelle / 1_000)}k`
        : valeurReelle.toLocaleString("fr-FR");

  const decalage = index % 2 === 0 ? -14 : 18;

  return (
    <text
      x={x} y={y + decalage}
      textAnchor="middle"
      fontSize={10}
      fontWeight={700}
      fill={couleur}
    >
      {affiche}
    </text>
  );
};

// ── Dot coloré ───────────────────────────────────────────────
const DotCV = (props) => {
  const { cx, cy, payload } = props;
  if (!cx || !cy) return null;
  const couleur = getCouleurCV(payload?.charge_virale_valeur);
  return (
    <circle
      key={`dot-${payload.date}`}
      cx={cx} cy={cy} r={4.5}
      fill="#0F172A"
      stroke={couleur}
      strokeWidth={2.5}
    />
  );
};

// ── Segments colorés ──────────────────────────────────────────
const LigneCV = ({ points, data }) => {
  if (!points || points.length < 2) return null;
  return (
    <g>
      {points.slice(0, -1).map((p1, i) => {
        const p2 = points[i + 1];
        if (!p1 || !p2 || p1.x == null || p2.x == null) return null;
        const v1 = data[i]?.charge_virale_valeur;
        const v2 = data[i + 1]?.charge_virale_valeur;
        if (v1 == null || v2 == null) return null;
        const couleur =
          v1 >= SEUIL_ELEVE || v2 >= SEUIL_ELEVE     ? COULEUR_CRIT
          : v1 >= SEUIL_INDETECTABLE || v2 >= SEUIL_INDETECTABLE ? COULEUR_MID
          : COULEUR_OK;
        return (
          <line
            key={`seg-${i}`}
            x1={p1.x} y1={p1.y}
            x2={p2.x} y2={p2.y}
            stroke={couleur}
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        );
      })}
    </g>
  );
};

// ── Composant principal ───────────────────────────────────────
const GraphiqueCV = ({ data = [], periodes = [], loading }) => {

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
        valeurLog:    p.charge_virale_valeur > 0 ? p.charge_virale_valeur : 1,
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

  const ticksLog = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000];

  return (
    <Card
      style={{ marginBottom: 16 }}
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          {/* Titre */}
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cv, flexShrink: 0,
          }} />
          <span>Évolution charge virale</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>copies/mL</span>

          {/* Séparateur */}
          <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />

          {/* Badges légende */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>

            {/* Indétectable */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEUR_OK, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Indétectable
                <span style={{ color: "#AAA", fontWeight: 400 }}> (&lt;{SEUIL_INDETECTABLE})</span>
              </span>
            </div>

            {/* Détectable */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEUR_MID, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Détectable
                <span style={{ color: "#AAA", fontWeight: 400 }}> (&lt;{SEUIL_ELEVE})</span>
              </span>
            </div>

            {/* Charge élevée */}
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEUR_CRIT, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Charge élevée
                <span style={{ color: "#AAA", fontWeight: 400 }}> (≥{SEUIL_ELEVE})</span>
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
          <ComposedChart
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
              tick={<TickX />}
              tickLine={{ stroke: "#334155" }}
              axisLine={{ stroke: "#334155" }}
              height={32}
            />

            <YAxis
              scale="log"
              domain={[1, "auto"]}
              ticks={ticksLog}
              tick={<TickY />}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              width={52}
              allowDataOverflow
            />

            <Tooltip
              cursor={{ stroke: "#475569", strokeWidth: 1, strokeDasharray: "4 2" }}
              content={<TooltipCV />}
            />

            {/* Lignes de référence sans label — légende dans le header */}
            {LIGNES_REF_CV.map((ligne) => (
              <ReferenceLine
                key={ligne.valeur}
                y={ligne.valeur}
                stroke={ligne.couleur}
                strokeDasharray={ligne.dash ?? "6 3"}
                strokeWidth={1.5}
              />
            ))}

            {/* Ligne principale multicolore */}
            <Line
              type="monotone"
              dataKey="valeurLog"
              stroke="transparent"
              strokeWidth={0}
              dot={<DotCV />}
              activeDot={{
                r: 6,
                fill: "#0F172A",
                stroke: "#94A3B8",
                strokeWidth: 2,
              }}
              connectNulls={false}
              shape={(props) => (
                <LigneCV points={props.points} data={dataAvecTraitement} />
              )}
            >
              <LabelList
                dataKey="valeurLog"
                content={(props) => (
                  <LabelValeur {...props} data={dataAvecTraitement} />
                )}
              />
            </Line>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Légende traitements */}
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