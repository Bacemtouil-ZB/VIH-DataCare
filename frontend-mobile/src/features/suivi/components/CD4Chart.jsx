// ============================================================
//  CD4Chart.jsx — SVG custom 100% mobile
//  Remplace Victory Native par react-native-svg natif
//  Courbe propre, lisible, responsive sur tout écran
// ============================================================

import React, { useMemo } from "react";
import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  Defs,
  LinearGradient,
  Stop,
  Rect,
} from "react-native-svg";

// ── Constantes ────────────────────────────────────────────────
const SEUIL_CRITIQUE = 200;
const COULEUR_OK     = "#22C55E";
const COULEUR_CRIT   = "#EF4444";
const COULEUR_REF    = "#F59E0B";
const COULEUR_GRID   = "#1E293B";
const COULEUR_AXIS   = "#334155";
const COULEUR_LABEL  = "#94A3B8";

const getCouleurCD4 = (valeur) => {
  if (valeur == null)          return COULEUR_OK;
  if (valeur < SEUIL_CRITIQUE) return COULEUR_CRIT;
  return COULEUR_OK;
};

const formatVal = (v) => {
  if (v == null) return "";
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return Math.round(v).toString();
};

const formatDate = (dateRaw) => {
  if (!dateRaw) return "";
  try {
    const str = String(dateRaw);
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, annee, mois, jour] = isoMatch;
      return `${jour}/${mois}/${annee}`;
    }
    const d = new Date(str);
    if (isNaN(d.getTime())) return str;
    const jour  = String(d.getDate()).padStart(2, "0");
    const mois  = String(d.getMonth() + 1).padStart(2, "0");
    const annee = d.getFullYear();
    return `${jour}/${mois}/${annee}`;
  } catch {
    return String(dateRaw);
  }
};

// ── Composant principal ───────────────────────────────────────
const CD4Chart = ({ data = [], periodes = [], autorisé = true }) => {
  if (!autorisé) return null;

  const screenWidth = Dimensions.get("window").width;

  // ✅ 1. dataEnrichie EN PREMIER — avant toute utilisation de .length
  const dataEnrichie = useMemo(() => {
    return data.map((p) => {
      const periode = periodes.find((pr) => {
        const debut = new Date(pr.date_debut);
        const fin   = pr.date_fin ? new Date(pr.date_fin) : new Date();
        const date  = new Date(p.date);
        return date >= debut && date <= fin;
      });
      return {
        ...p,
        traitement: periode?.nom_medicament ?? periode?.code_medicament ?? null,
      };
    });
  }, [data, periodes]);

  // ✅ 2. Dimensions APRÈS — dataEnrichie.length est valide
  const MIN_POINT_SPACING = 60;
  const SVG_W      = Math.max(
    screenWidth - 32,
    dataEnrichie.length * MIN_POINT_SPACING + 64
  );
  const SVG_H      = 230;
  const PAD_LEFT   = 46;
  const PAD_RIGHT  = 18;
  const PAD_TOP    = 24;
  const PAD_BOTTOM = 38;
  const PLOT_W     = SVG_W - PAD_LEFT - PAD_RIGHT;
  const PLOT_H     = SVG_H - PAD_TOP - PAD_BOTTOM;

  // Cas vide
  if (!data || data.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#6366F1" }]} />
          <Text style={styles.titre}>Évolution CD4</Text>
          <Text style={styles.unite}>cell/mm³</Text>
        </View>
        <View style={styles.vide}>
          <Text style={styles.videTexte}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  // ── Domaine Y ─────────────────────────────────────────────
  const valeurs   = dataEnrichie.map((d) => d.y).filter((v) => v != null);
  const minVal    = Math.min(...valeurs, SEUIL_CRITIQUE);
  const maxVal    = Math.max(...valeurs, SEUIL_CRITIQUE);
  const padY      = Math.max((maxVal - minVal) * 0.28, 60);
  const domainMin = Math.max(0, minVal - padY);
  const domainMax = maxVal + padY;

  // ── Fonctions de mise à l'échelle ─────────────────────────
  const scaleX = (i) =>
    PAD_LEFT + (dataEnrichie.length === 1 ? PLOT_W / 2 : (i / (dataEnrichie.length - 1)) * PLOT_W);

  const scaleY = (v) =>
    PAD_TOP + PLOT_H - ((v - domainMin) / (domainMax - domainMin)) * PLOT_H;

  // ── Segments colorés avec courbe bezier ───────────────────
  const dataIndexed = dataEnrichie.map((d, i) => ({ ...d, index: i }));

  const segments = [];
  for (let i = 0; i < dataIndexed.length - 1; i++) {
    const a = dataIndexed[i];
    const b = dataIndexed[i + 1];
    if (a.y == null || b.y == null) continue;
    const x1 = scaleX(i);
    const y1 = scaleY(a.y);
    const x2 = scaleX(i + 1);
    const y2 = scaleY(b.y);
    const cx = (x1 + x2) / 2;
    segments.push({
      path:    `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      couleur: getCouleurCD4(a.cd4_absolu),
    });
  }

  // ── Grille Y (5 niveaux) ──────────────────────────────────
  const ticksY = Array.from({ length: 5 }, (_, i) => {
    const val = domainMin + (i / 4) * (domainMax - domainMin);
    return { val: Math.round(val), y: scaleY(val) };
  });

  // ── Labels X (max 4, bien espacés) ────────────────────────
  const maxTicksX = Math.min(4, dataIndexed.length);
  const ticksX = Array.from({ length: maxTicksX }, (_, i) => {
    const idx = Math.round((i / Math.max(maxTicksX - 1, 1)) * (dataIndexed.length - 1));
    return dataIndexed[Math.min(idx, dataIndexed.length - 1)];
  });

  // ── Position seuil ────────────────────────────────────────
  const seuilY = scaleY(SEUIL_CRITIQUE);

  // ── Affichage label : alterner haut/bas ───────────────────
  const lastIdx = dataIndexed.length - 1;
  const showLabel = (i) =>
    i === 0 || i === lastIdx || dataIndexed.length <= 7 || i % 2 === 0;
  const getLabelDy = (i) => {
    if (i === lastIdx && lastIdx % 2 !== 0) return -12;
    return i % 2 === 0 ? -12 : 14;
  };

  return (
    <View style={styles.card}>
      {/* ── En-tête ── */}
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: "#6366F1" }]} />
        <Text style={styles.titre}>Évolution CD4</Text>
        <Text style={styles.unite}>cell/mm³</Text>
      </View>

      {/* ── Légende ── */}
      <View style={styles.legendeGroupe}>
        <View style={styles.legendeItem}>
          <View style={[styles.legendeLigne, { backgroundColor: COULEUR_OK }]} />
          <Text style={styles.legendeTexte}>Normal (≥{SEUIL_CRITIQUE})</Text>
        </View>
        <View style={styles.legendeItem}>
          <View style={[styles.legendeLigne, { backgroundColor: COULEUR_CRIT }]} />
          <Text style={styles.legendeTexte}>Critique (&lt;{SEUIL_CRITIQUE})</Text>
        </View>
      </View>

      {/* ── Graphique scrollable ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollWrapper}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        <View style={styles.graphiqueWrapper}>
          <Svg width={SVG_W} height={SVG_H}>
            <Defs>
              <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0F172A" stopOpacity="1" />
                <Stop offset="1" stopColor="#080D18" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* Fond */}
            <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="url(#bgGrad)" rx={10} />

            {/* Grille horizontale */}
            {ticksY.map((t, i) => (
              <Line
                key={`grid-${i}`}
                x1={PAD_LEFT}
                y1={t.y}
                x2={SVG_W - PAD_RIGHT}
                y2={t.y}
                stroke={COULEUR_GRID}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {/* Labels axe Y */}
            {ticksY.map((t, i) => (
              <SvgText
                key={`ylabel-${i}`}
                x={PAD_LEFT - 5}
                y={t.y + 4}
                textAnchor="end"
                fontSize={9}
                fill={COULEUR_LABEL}
              >
                {formatVal(t.val)}
              </SvgText>
            ))}

            {/* Labels axe X */}
            {ticksX.map((d, i) => (
              <SvgText
                key={`xlabel-${i}`}
                x={scaleX(d.index)}
                y={SVG_H - 8}
                textAnchor="middle"
                fontSize={9}
                fill={COULEUR_LABEL}
              >
                {formatDate(d.date)}
              </SvgText>
            ))}

            {/* Ligne axe X */}
            <Line
              x1={PAD_LEFT}
              y1={PAD_TOP + PLOT_H}
              x2={SVG_W - PAD_RIGHT}
              y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS}
              strokeWidth={1}
            />

            {/* Ligne axe Y */}
            <Line
              x1={PAD_LEFT}
              y1={PAD_TOP}
              x2={PAD_LEFT}
              y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS}
              strokeWidth={1}
            />

            {/* Ligne seuil critique */}
            <Line
              x1={PAD_LEFT}
              y1={seuilY}
              x2={SVG_W - PAD_RIGHT}
              y2={seuilY}
              stroke={COULEUR_REF}
              strokeWidth={1.5}
              strokeDasharray="7 4"
            />

            {/* Segments courbe multicolore */}
            {segments.map((seg, i) => (
              <Path
                key={`seg-${i}`}
                d={seg.path}
                stroke={seg.couleur}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {/* Points + labels valeurs */}
            {dataIndexed.map((d, i) => {
              if (d.y == null) return null;
              const cx      = scaleX(i);
              const cy      = scaleY(d.y);
              const couleur = getCouleurCD4(d.cd4_absolu);
              return (
                <React.Fragment key={`pt-${i}`}>
                  <Circle cx={cx} cy={cy} r={8} fill={couleur} opacity={0.15} />
                  <Circle cx={cx} cy={cy} r={4.5} fill={couleur} stroke="#0F172A" strokeWidth={2} />
                  {showLabel(i) && (
                    <SvgText
                      x={cx}
                      y={cy + getLabelDy(i)}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight="bold"
                      fill={couleur}
                    >
                      {formatVal(d.cd4_absolu)}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>

      {/* ── Légende seuil bas ── */}
      <View style={styles.refLegend}>
        <View style={styles.refLigneDash} />
        <Text style={styles.refTexte}>Seuil critique {SEUIL_CRITIQUE} cell/mm³</Text>
      </View>
    </View>
  );
};

// ── Styles ────────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginBottom: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
    flexWrap: "wrap",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  titre: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  unite: {
    fontSize: 11,
    color: "#94A3B8",
  },
  legendeGroupe: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  legendeItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendeLigne: {
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  legendeTexte: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },
  graphiqueWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  scrollWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  vide: {
    padding: 40,
    alignItems: "center",
  },
  videTexte: {
    color: "#94A3B8",
    fontSize: 13,
  },
  refLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  refLigneDash: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: COULEUR_REF,
  },
  refTexte: {
    fontSize: 11,
    color: "#94A3B8",
  },
});

export default CD4Chart;