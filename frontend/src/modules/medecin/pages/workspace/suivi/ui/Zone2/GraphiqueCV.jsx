
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
  COULEURS_GRAPHIQUE,
} from "../../constants/suiviConstants";
import { formatDate } from "../../helpers/suiviHelpers";
import {
  LigneMulticolore,
  DotColore,
  LabelValeurAlternee,
} from "./GraphiqueShared";

// ── Logique couleur CV (2 zones) ─────────────────────────────
// Vert  : < SEUILS_CV.INDETECTABLE (200)
// Rouge : ≥ SEUILS_CV.INDETECTABLE (200)
const getCouleurCV = (valeur) => {
  if (valeur == null)                  return COULEURS_GRAPHIQUE.OK;
  if (valeur < SEUILS_CV.INDETECTABLE) return COULEURS_GRAPHIQUE.OK;
  return COULEURS_GRAPHIQUE.CRIT;
};

// ── Formateur label CV ────────────────────────────────────────
const formaterCV = (valeur) => {
  if (valeur == null) return "";
  if (valeur >= 1_000_000) return `${(valeur / 1_000_000).toFixed(1)}M`;
  if (valeur >= 1_000)     return `${Math.round(valeur / 1_000)}k`;
  return valeur.toLocaleString("fr-FR");
};

// ── Tooltip ───────────────────────────────────────────────────
// Règle : toujours afficher le chiffre réel.
// Si < seuil indétectable → chiffre + badge "Indétectable"
// Sinon → chiffre + copies/mL
const TooltipCV = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point   = payload[0]?.payload;
  const valeur  = point?.charge_virale_valeur;
  const couleur = getCouleurCV(valeur);

  const estIndetectable = valeur != null && valeur < SEUILS_CV.INDETECTABLE;

  // Affichage du chiffre — toujours présent si valeur existe
  const chiffreAffiche = valeur == null
    ? "—"
    : `${valeur.toLocaleString("fr-FR")} copies/mL`;

  const statutLabel = valeur == null
    ? "—"
    : valeur < SEUILS_CV.INDETECTABLE
      ? "Indétectable"
      : "Détectable";

  return (
    <div style={{
      background:   "#1E293B",
      border:       "1px solid #334155",
      borderRadius: 8,
      padding:      "10px 14px",
      fontSize:     13,
      boxShadow:    "0 4px 20px rgba(0,0,0,0.4)",
      minWidth:     210,
    }}>
      {/* Date */}
      <div style={{
        fontWeight: 600, marginBottom: 8, color: "#F1F5F9",
        borderBottom: "1px solid #334155", paddingBottom: 6,
      }}>
        {formatDate(point?.date)}
      </div>

      {/* Chiffre — toujours affiché */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
        <span style={{ color: "#94A3B8" }}>Charge virale</span>
        <span style={{ color: couleur, fontWeight: 700 }}>{chiffreAffiche}</span>
      </div>

      {/* Badge statut + mention indétectable si applicable */}
      <div style={{
        marginTop: 8, paddingTop: 6,
        borderTop: "1px solid #334155",
        display: "flex", alignItems: "center", gap: 6,
      }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: couleur }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: couleur }}>
          {statutLabel}
        </span>
        {estIndetectable && (
          <span style={{ fontSize: 10, color: "#64748B", fontStyle: "italic" }}>
            (seuil &lt;{SEUILS_CV.INDETECTABLE})
          </span>
        )}
      </div>

      {/* Traitement */}
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

      {/* Type bilan */}
      {point?.type_bilan && (
        <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>
          Bilan {point.type_bilan}
        </div>
      )}
    </div>
  );
};

// ── Ticks axes ────────────────────────────────────────────────
const TickX = ({ x, y, payload }) => {
  if (!payload?.value) return null;
  return (
    <text x={x} y={y + 14} textAnchor="middle" fontSize={11} fill="#94A3B8">
      {payload.value}
    </text>
  );
};

const TickY = ({ x, y, payload }) => {
  const v = payload?.value;
  if (!v) return null;
  const label =
    v >= 1_000_000 ? `${v / 1_000_000}M`
    : v >= 1_000   ? `${v / 1_000}k`
    : `${v}`;
  return (
    <text x={x - 4} y={y + 4} textAnchor="end" fontSize={11} fill="#94A3B8">
      {label}
    </text>
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
        // valeurLog : toujours > 0 pour l'axe logarithmique
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
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cv, flexShrink: 0,
          }} />
          <span>Évolution charge virale</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>copies/mL</span>

          <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEURS_GRAPHIQUE.OK, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Indétectable
                <span style={{ color: "#AAA", fontWeight: 400 }}> (&lt;{SEUILS_CV.INDETECTABLE})</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEURS_GRAPHIQUE.CRIT, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Détectable
                <span style={{ color: "#AAA", fontWeight: 400 }}> (≥{SEUILS_CV.INDETECTABLE})</span>
              </span>
            </div>
          </div>
        </div>
      }
    >
      <div style={{
        background: "#0F172A", borderRadius: 10,
        padding: "16px 12px 12px 4px", overflow: "hidden",
      }}>
        <ResponsiveContainer width="100%" height={CONFIG_GRAPHIQUE.hauteur ?? 300}>
          <ComposedChart
            data={dataAvecTraitement}
            margin={{ top: 22, right: 28, left: 0, bottom: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />

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

            {LIGNES_REF_CV.map((ligne) => (
              <ReferenceLine
                key={ligne.valeur}
                y={ligne.valeur}
                stroke={ligne.couleur}
                strokeDasharray={ligne.dash ?? "6 3"}
                strokeWidth={1.5}
              />
            ))}

            {/* dataKey="valeurLog" pour l'axe log, mais on passe dataKeyReel
                pour que LigneMulticolore et DotColore utilisent la vraie valeur */}
            <Line
              type="monotone"
              dataKey="valeurLog"
              stroke="transparent"
              strokeWidth={0}
              dot={(props) => (
                <DotColore
                  {...props}
                  dataKey="charge_virale_valeur"
                  getCouleur={getCouleurCV}
                />
              )}
              activeDot={{ r: 6, fill: "#0F172A", stroke: "#94A3B8", strokeWidth: 2 }}
              connectNulls={false}
              shape={(props) => (
                <LigneMulticolore
                  points={props.points}
                  data={dataAvecTraitement}
                  getCouleur={getCouleurCV}
                  dataKey="charge_virale_valeur"
                />
              )}
            >
              <LabelList
                dataKey="valeurLog"
                content={(props) => (
                  <LabelValeurAlternee
                    {...props}
                    getCouleur={getCouleurCV}
                    formater={formaterCV}
                    data={dataAvecTraitement}
                    dataKeyReel="charge_virale_valeur"
                  />
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