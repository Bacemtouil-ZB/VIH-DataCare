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
  SEUILS_CD4,
  COULEURS_GRAPHIQUE,
} from "../../constants/suiviConstants";
import { formatTooltipCD4, formatDate } from "../../helpers/suiviHelpers";
import {
  LigneMulticolore,
  DotColore,
  LabelValeurAlternee,
} from "./GraphiqueShared";

// ── Logique couleur CD4 (2 zones) ────────────────────────────
const getCouleurCD4 = (valeur) => {
  if (valeur == null)                      return COULEURS_GRAPHIQUE.OK;
  if (valeur < SEUILS_CD4.CRITIQUE)        return COULEURS_GRAPHIQUE.CRIT;
  return COULEURS_GRAPHIQUE.OK;
};

// ── Formateur label ───────────────────────────────────────────
const formaterCD4 = (valeur) => {
  if (valeur == null) return "";
  return valeur.toLocaleString("fr-FR");
};

// ── Tooltip ───────────────────────────────────────────────────
const TooltipCD4 = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point   = payload[0]?.payload;
  const couleur = getCouleurCD4(point?.cd4_absolu);

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
        <span style={{ color: couleur, fontWeight: 700 }}>
          {formatTooltipCD4(point?.cd4_absolu)}
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
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: couleur }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: couleur }}>
          {point?.cd4_absolu < SEUILS_CD4.CRITIQUE ? "Zone critique" : "Normal"}
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
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            background: CONFIG_GRAPHIQUE.couleur_cd4, flexShrink: 0,
          }} />
          <span>Évolution CD4</span>
          <span style={{ fontSize: 12, color: "#AAA", fontWeight: 400 }}>cell/mm³</span>

          <div style={{ width: 1, height: 16, background: "#E5E7EB", margin: "0 4px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEURS_GRAPHIQUE.OK, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>Normal</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 20, height: 3, background: COULEURS_GRAPHIQUE.CRIT, borderRadius: 2 }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Critique
                <span style={{ color: "#AAA", fontWeight: 400 }}> (&lt;{SEUILS_CD4.CRITIQUE})</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 20, height: 3, borderRadius: 2,
                background: `repeating-linear-gradient(90deg, ${COULEURS_GRAPHIQUE.OBJ} 0px, ${COULEURS_GRAPHIQUE.OBJ} 4px, transparent 4px, transparent 7px)`,
              }} />
              <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>
                Objectif
                <span style={{ color: "#AAA", fontWeight: 400 }}> (≥{SEUILS_CD4.MOYEN_MAX})</span>
              </span>
            </div>
          </div>
        </div>
      }
    >
     
    
<div style={{
  background: "transparent",  // ← plus de fond noir
  borderRadius: 10,
  padding: "16px 12px 12px 4px",
  overflow: "hidden",
}}>
  <ResponsiveContainer width="100%" height={CONFIG_GRAPHIQUE.hauteur ?? 300}>
    <LineChart
      data={dataAvecTraitement}
      margin={{ top: 22, right: 28, left: 0, bottom: 4 }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />

      <XAxis
        dataKey="dateAffichee"
        stroke="#D1D5DB"
        tick={{ fontSize: 11, fill: "#6B7280" }}  
        tickLine={{ stroke: "#E5E7EB" }}
        axisLine={{ stroke: "#E5E7EB" }}
        height={32}
      />

      <YAxis
        width={52}
        stroke="#D1D5DB"
        tick={{ fontSize: 11, fill: "#6B7280" }}   
        tickLine={false}
        axisLine={{ stroke: "#E5E7EB" }}
        domain={[0, "auto"]}
        tickFormatter={(v) => v.toLocaleString("fr-FR")}
      />

      <Tooltip
        cursor={{ stroke: "#9CA3AF", strokeWidth: 1, strokeDasharray: "4 2" }}
        content={<TooltipCD4 />}
      />

            {LIGNES_REF_CD4.map((ligne) => (
              <ReferenceLine
                key={ligne.valeur}
                y={ligne.valeur}
                stroke={ligne.couleur}
                strokeDasharray="6 3"
                strokeWidth={1.5}
              />
            ))}

            <Line
              type="monotone"
              dataKey="cd4_absolu"
              stroke="transparent"
              strokeWidth={0}
              dot={(props) => (
                <DotColore
                  {...props}
                  dataKey="cd4_absolu"
                  getCouleur={getCouleurCD4}
                />
              )}
              activeDot={{ r: 6, fill: "#0F172A", stroke: "#94A3B8", strokeWidth: 2 }}
              connectNulls={false}
              shape={(props) => (
                <LigneMulticolore
                  points={props.points}
                  data={dataAvecTraitement}
                  getCouleur={getCouleurCD4}
                  dataKey="cd4_absolu"
                />
              )}
            >
              <LabelList
                dataKey="cd4_absolu"
                content={(props) => (
                  <LabelValeurAlternee
                    {...props}
                    getCouleur={getCouleurCD4}
                    formater={formaterCD4}
                  />
                )}
              />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GraphiqueCD4;