// // ============================================================
// //  ChargeViraleChart.jsx — SVG custom 100% mobile
// //  Même architecture que CD4Chart
// //  Échelle Y logarithmique
// //  Scrollable horizontal
// // ============================================================

// import React, { useMemo } from "react";
// import { View, Text, StyleSheet, Dimensions, ScrollView } from "react-native";
// import Svg, {
//   Path,
//   Circle,
//   Line,
//   Text as SvgText,
//   Defs,
//   LinearGradient,
//   Stop,
//   Rect,
// } from "react-native-svg";

// // ── Constantes ────────────────────────────────────────────────
// const SEUIL_INDETECTABLE = 200;
// const COULEUR_OK         = "#22C55E";
// const COULEUR_CRIT       = "#EF4444";
// const COULEUR_REF        = "#F59E0B";
// const COULEUR_GRID       = "#1E293B";
// const COULEUR_AXIS       = "#334155";
// const COULEUR_LABEL      = "#94A3B8";

// const getCouleurCV = (valeur) => {
//   if (valeur == null)                return COULEUR_OK;
//   if (valeur < SEUIL_INDETECTABLE)   return COULEUR_OK;
//   return COULEUR_CRIT;
// };

// const formatVal = (v) => {
//   if (v == null) return "";
//   if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
//   if (v >= 1_000)     return `${Math.round(v / 1_000)}k`;
//   return Math.round(v).toString();
// };

// // Parse date ISO locale sans décalage UTC
// const formatDate = (dateRaw) => {
//   if (!dateRaw) return "";
//   try {
//     const str = String(dateRaw);
//     const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
//     if (isoMatch) {
//       const [, annee, mois, jour] = isoMatch;
//       return `${jour}/${mois}/${annee}`;
//     }
//     const d = new Date(str);
//     if (isNaN(d.getTime())) return str;
//     const jour  = String(d.getDate()).padStart(2, "0");
//     const mois  = String(d.getMonth() + 1).padStart(2, "0");
//     const annee = d.getFullYear();
//     return `${jour}/${mois}/${annee}`;
//   } catch {
//     return String(dateRaw);
//   }
// };

// // ── Échelle logarithmique ─────────────────────────────────────
// const toLog = (v) => Math.log10(Math.max(v, 1));

// // ── Composant principal ───────────────────────────────────────
// const ChargeViraleChart = ({ data = [], periodes = [], autorisé = true }) => {
//   if (!autorisé) return null;

//   const screenWidth = Dimensions.get("window").width;

//   // Dimensions SVG
//   const MIN_POINT_SPACING = 60;
//   const safeData = Array.isArray(data) ? data : [];
//   const SVG_W      = Math.max(
//     screenWidth - 32,
//     safeData.length * MIN_POINT_SPACING + 64
//   );
//   const SVG_H      = 230;
//   const PAD_LEFT   = 46;
//   const PAD_RIGHT  = 18;
//   const PAD_TOP    = 24;
//   const PAD_BOTTOM = 38;
//   const PLOT_W     = SVG_W - PAD_LEFT - PAD_RIGHT;
//   const PLOT_H     = SVG_H - PAD_TOP - PAD_BOTTOM;

//   // Données enrichies
//   const dataEnrichie = useMemo(() => {
//     return safeData.map((p) => {
//       const periode = (Array.isArray(periodes) ? periodes : []).find((pr) => {
//         const debut = new Date(pr.date_debut);
//         const fin   = pr.date_fin ? new Date(pr.date_fin) : new Date();
//         const date  = new Date(p.date);
//         return date >= debut && date <= fin;
//       });
//       return {
//         ...p,
//         traitement: periode?.nom_medicament ?? periode?.code_medicament ?? null,
//         yLog: p.charge_virale_valeur > 0 ? p.charge_virale_valeur : 1,
//       };
//     });
//   }, [safeData, periodes]);

//   // Cas vide
//   if (safeData.length === 0) {
//     return (
//       <View style={styles.card}>
//         <View style={styles.header}>
//           <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
//           <Text style={styles.titre}>Évolution charge virale</Text>
//           <Text style={styles.unite}>copies/mL</Text>
//         </View>
//         <View style={styles.vide}>
//           <Text style={styles.videTexte}>Aucune donnée disponible</Text>
//         </View>
//       </View>
//     );
//   }

//   // ── Domaine Y log ─────────────────────────────────────────
//   const valeursLog  = dataEnrichie.map((d) => d.yLog).filter((v) => v > 0);
//   const minLog      = toLog(Math.min(...valeursLog, SEUIL_INDETECTABLE));
//   const maxLog      = toLog(Math.max(...valeursLog, SEUIL_INDETECTABLE)) + 0.5;

//   // ── Échelle ───────────────────────────────────────────────
//   const scaleX = (i) =>
//     PAD_LEFT + (dataEnrichie.length === 1 ? PLOT_W / 2 : (i / (dataEnrichie.length - 1)) * PLOT_W);

//   const scaleY = (v) => {
//     const logV = toLog(Math.max(v, 1));
//     return PAD_TOP + PLOT_H - ((logV - minLog) / (maxLog - minLog)) * PLOT_H;
//   };

//   // ── Segments colorés bezier ───────────────────────────────
//   const dataIndexed = dataEnrichie.map((d, i) => ({ ...d, index: i }));

//   const segments = [];
//   for (let i = 0; i < dataIndexed.length - 1; i++) {
//     const a  = dataIndexed[i];
//     const b  = dataIndexed[i + 1];
//     if (!a.yLog || !b.yLog) continue;
//     const x1 = scaleX(i);
//     const y1 = scaleY(a.yLog);
//     const x2 = scaleX(i + 1);
//     const y2 = scaleY(b.yLog);
//     const cx = (x1 + x2) / 2;
//     segments.push({
//       path:    `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
//       couleur: getCouleurCV(a.charge_virale_valeur),
//     });
//   }

//   // ── Ticks Y log (puissances de 10) ───────────────────────
//   const ticksYLog = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000].filter(
//     (v) => toLog(v) >= minLog - 0.2 && toLog(v) <= maxLog + 0.2
//   );

//   // ── Ticks X (max 4) ───────────────────────────────────────
//   const maxTicksX = Math.min(4, dataIndexed.length);
//   const ticksX = Array.from({ length: maxTicksX }, (_, i) => {
//     const idx = Math.round((i / Math.max(maxTicksX - 1, 1)) * (dataIndexed.length - 1));
//     return dataIndexed[Math.min(idx, dataIndexed.length - 1)];
//   });

//   // ── Seuil indétectable ────────────────────────────────────
//   const seuilY = scaleY(SEUIL_INDETECTABLE);

//   // ── Labels ────────────────────────────────────────────────
//   const lastIdx   = dataIndexed.length - 1;
//   const showLabel = (i) =>
//     i === 0 || i === lastIdx || dataIndexed.length <= 7 || i % 2 === 0;
//   const getLabelDy = (i) => {
//     if (i === lastIdx && lastIdx % 2 !== 0) return -12;
//     return i % 2 === 0 ? -12 : 14;
//   };
// console.log("CVChart reçoit data:", data, "periodes:", periodes);
//   return (
//     <View style={styles.card}>
//       {/* ── En-tête ── */}
//       <View style={styles.header}>
//         <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
//         <Text style={styles.titre}>Évolution charge virale</Text>
//         <Text style={styles.unite}>copies/mL</Text>
//       </View>

//       {/* ── Légende ── */}
//       <View style={styles.legendeGroupe}>
//         <View style={styles.legendeItem}>
//           <View style={[styles.legendeLigne, { backgroundColor: COULEUR_OK }]} />
//           <Text style={styles.legendeTexte}>Indétectable (&lt;{SEUIL_INDETECTABLE})</Text>
//         </View>
//         <View style={styles.legendeItem}>
//           <View style={[styles.legendeLigne, { backgroundColor: COULEUR_CRIT }]} />
//           <Text style={styles.legendeTexte}>Détectable</Text>
//         </View>
//       </View>

//       {/* ── Graphique scrollable ── */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.scrollWrapper}
//         contentContainerStyle={{ paddingRight: 8 }}
//       >
//         <View style={styles.graphiqueWrapper}>
//           <Svg width={SVG_W} height={SVG_H}>
//             <Defs>
//               <LinearGradient id="bgGradCV" x1="0" y1="0" x2="0" y2="1">
//                 <Stop offset="0" stopColor="#0F172A" stopOpacity="1" />
//                 <Stop offset="1" stopColor="#080D18" stopOpacity="1" />
//               </LinearGradient>
//             </Defs>

//             {/* Fond */}
//             <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="url(#bgGradCV)" rx={10} />

//             {/* Grille horizontale sur ticks log */}
//             {ticksYLog.map((v, i) => (
//               <Line
//                 key={`grid-${i}`}
//                 x1={PAD_LEFT}
//                 y1={scaleY(v)}
//                 x2={SVG_W - PAD_RIGHT}
//                 y2={scaleY(v)}
//                 stroke={COULEUR_GRID}
//                 strokeWidth={1}
//                 strokeDasharray="4 4"
//               />
//             ))}

//             {/* Labels axe Y */}
//             {ticksYLog.map((v, i) => (
//               <SvgText
//                 key={`ylabel-${i}`}
//                 x={PAD_LEFT - 5}
//                 y={scaleY(v) + 4}
//                 textAnchor="end"
//                 fontSize={9}
//                 fill={COULEUR_LABEL}
//               >
//                 {formatVal(v)}
//               </SvgText>
//             ))}

//             {/* Labels axe X */}
//             {ticksX.map((d, i) => (
//               <SvgText
//                 key={`xlabel-${i}`}
//                 x={scaleX(d.index)}
//                 y={SVG_H - 8}
//                 textAnchor="middle"
//                 fontSize={9}
//                 fill={COULEUR_LABEL}
//               >
//                 {formatDate(d.date)}
//               </SvgText>
//             ))}

//             {/* Axes */}
//             <Line x1={PAD_LEFT} y1={PAD_TOP + PLOT_H} x2={SVG_W - PAD_RIGHT} y2={PAD_TOP + PLOT_H} stroke={COULEUR_AXIS} strokeWidth={1} />
//             <Line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + PLOT_H} stroke={COULEUR_AXIS} strokeWidth={1} />

//             {/* Ligne seuil indétectable */}
//             <Line
//               x1={PAD_LEFT}
//               y1={seuilY}
//               x2={SVG_W - PAD_RIGHT}
//               y2={seuilY}
//               stroke={COULEUR_REF}
//               strokeWidth={1.5}
//               strokeDasharray="7 4"
//             />

//             {/* Segments courbe */}
//             {segments.map((seg, i) => (
//               <Path
//                 key={`seg-${i}`}
//                 d={seg.path}
//                 stroke={seg.couleur}
//                 strokeWidth={2.5}
//                 fill="none"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//               />
//             ))}

//             {/* Points + labels */}
//             {dataIndexed.map((d, i) => {
//               if (!d.yLog) return null;
//               const cx      = scaleX(i);
//               const cy      = scaleY(d.yLog);
//               const couleur = getCouleurCV(d.charge_virale_valeur);
//               return (
//                 <React.Fragment key={`pt-${i}`}>
//                   <Circle cx={cx} cy={cy} r={8}   fill={couleur} opacity={0.15} />
//                   <Circle cx={cx} cy={cy} r={4.5} fill={couleur} stroke="#0F172A" strokeWidth={2} />
//                   {showLabel(i) && (
//                     <SvgText
//                       x={cx}
//                       y={cy + getLabelDy(i)}
//                       textAnchor="middle"
//                       fontSize={9}
//                       fontWeight="bold"
//                       fill={couleur}
//                     >
//                       {formatVal(d.charge_virale_valeur)}
//                     </SvgText>
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </Svg>
//         </View>
//       </ScrollView>

//       {/* ── Légende seuil ── */}
//       <View style={styles.refLegend}>
//         <View style={styles.refLigneDash} />
//         <Text style={styles.refTexte}>Seuil indétectable {SEUIL_INDETECTABLE} copies/mL</Text>
//       </View>

//       {/* ── Traitements ARV ── */}
//       {Array.isArray(periodes) && periodes.length > 0 && (
//         <View style={styles.traitements}>
//           {periodes.map((periode, i) => (
//             <View key={periode.medicament_id ?? i} style={styles.traitementItem}>
//               <View style={styles.traitementDot} />
//               <Text style={styles.traitementNom}>
//                 {periode.nom_medicament ?? periode.code_medicament}
//               </Text>
//               {!periode.date_fin && (
//                 <View style={styles.enCoursBadge}>
//                   <Text style={styles.enCoursTexte}>en cours</Text>
//                 </View>
//               )}
//             </View>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };

// // ── Styles ────────────────────────────────────────────────────
// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: "#FFFFFF",
//     borderRadius: 14,
//     marginBottom: 16,
//     paddingVertical: 14,
//     paddingHorizontal: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 6,
//     marginBottom: 8,
//     flexWrap: "wrap",
//   },
//   dot: { width: 10, height: 10, borderRadius: 5 },
//   titre: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
//   unite: { fontSize: 11, color: "#94A3B8" },
//   legendeGroupe: { flexDirection: "row", gap: 14, marginBottom: 10, flexWrap: "wrap" },
//   legendeItem:   { flexDirection: "row", alignItems: "center", gap: 5 },
//   legendeLigne:  { width: 18, height: 3, borderRadius: 2 },
//   legendeTexte:  { fontSize: 11, color: "#555", fontWeight: "500" },
//   scrollWrapper: { borderRadius: 10, overflow: "hidden" },
//   graphiqueWrapper: { borderRadius: 10, overflow: "hidden" },
//   vide:          { padding: 40, alignItems: "center" },
//   videTexte:     { color: "#94A3B8", fontSize: 13 },
//   refLegend:     { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
//   refLigneDash:  { width: 22, height: 2, borderRadius: 1, backgroundColor: COULEUR_REF },
//   refTexte:      { fontSize: 11, color: "#94A3B8" },
//   traitements:   { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F5F5F5", gap: 6 },
//   traitementItem:{ flexDirection: "row", alignItems: "center", gap: 6 },
//   traitementDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1E40AF" },
//   traitementNom: { fontSize: 12, color: "#555", fontWeight: "500", flex: 1 },
//   enCoursBadge:  { backgroundColor: "#2E7D32", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
//   enCoursTexte:  { fontSize: 10, color: "#fff", fontWeight: "500" },
// });

// export default ChargeViraleChart;

// ============================================================
//  ChargeViraleChart.jsx — SVG custom 100% mobile
//  Gestion permission 403 : bloc "accès fermé"
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
const SEUIL_INDETECTABLE = 200;
const COULEUR_OK         = "#22C55E";
const COULEUR_CRIT       = "#EF4444";
const COULEUR_REF        = "#F59E0B";
const COULEUR_GRID       = "#1E293B";
const COULEUR_AXIS       = "#334155";
const COULEUR_LABEL      = "#94A3B8";

const getCouleurCV = (valeur) => {
  if (valeur == null)                return COULEUR_OK;
  if (valeur < SEUIL_INDETECTABLE)   return COULEUR_OK;
  return COULEUR_CRIT;
};

const formatVal = (v) => {
  if (v == null) return "";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000)     return `${Math.round(v / 1_000)}k`;
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

const toLog = (v) => Math.log10(Math.max(v, 1));

// ── Composant principal ───────────────────────────────────────
const ChargeViraleChart = ({ data = [], periodes = [], autorisé = true }) => {
  const screenWidth = Dimensions.get("window").width;

  const safeData = Array.isArray(data) ? data : [];

  const dataEnrichie = useMemo(() => {
    return safeData.map((p) => {
      const periode = (Array.isArray(periodes) ? periodes : []).find((pr) => {
        const debut = new Date(pr.date_debut);
        const fin   = pr.date_fin ? new Date(pr.date_fin) : new Date();
        const date  = new Date(p.date);
        return date >= debut && date <= fin;
      });
      return {
        ...p,
        traitement: periode?.nom_medicament ?? periode?.code_medicament ?? null,
        yLog: p.charge_virale_valeur > 0 ? p.charge_virale_valeur : 1,
      };
    });
  }, [safeData, periodes]);

  const MIN_POINT_SPACING = 60;
  const SVG_W      = Math.max(screenWidth - 32, safeData.length * MIN_POINT_SPACING + 64);
  const SVG_H      = 230;
  const PAD_LEFT   = 46;
  const PAD_RIGHT  = 18;
  const PAD_TOP    = 24;
  const PAD_BOTTOM = 38;
  const PLOT_W     = SVG_W - PAD_LEFT - PAD_RIGHT;
  const PLOT_H     = SVG_H - PAD_TOP - PAD_BOTTOM;

  // ── Bloc "accès fermé" ────────────────────────────────────
  if (!autorisé) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
          <Text style={styles.titre}>Évolution charge virale</Text>
          <Text style={styles.unite}>copies/mL</Text>
        </View>
        <View style={styles.accesFerme}>
          <Text style={styles.accesFermeIcon}>🔒</Text>
          <Text style={styles.accesFermeTitre}>Accès non autorisé</Text>
          <Text style={styles.accesFermeTexte}>
            Votre médecin n'a pas encore activé l'accès à vos données de charge virale.
          </Text>
        </View>
      </View>
    );
  }

  // ── Cas vide ──────────────────────────────────────────────
  if (safeData.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
          <Text style={styles.titre}>Évolution charge virale</Text>
          <Text style={styles.unite}>copies/mL</Text>
        </View>
        <View style={styles.vide}>
          <Text style={styles.videTexte}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  // ── Domaine Y log ─────────────────────────────────────────
  const valeursLog = dataEnrichie.map((d) => d.yLog).filter((v) => v > 0);
  const minLog     = toLog(Math.min(...valeursLog, SEUIL_INDETECTABLE));
  const maxLog     = toLog(Math.max(...valeursLog, SEUIL_INDETECTABLE)) + 0.5;

  const scaleX = (i) =>
    PAD_LEFT + (dataEnrichie.length === 1 ? PLOT_W / 2 : (i / (dataEnrichie.length - 1)) * PLOT_W);

  const scaleY = (v) => {
    const logV = toLog(Math.max(v, 1));
    return PAD_TOP + PLOT_H - ((logV - minLog) / (maxLog - minLog)) * PLOT_H;
  };

  const dataIndexed = dataEnrichie.map((d, i) => ({ ...d, index: i }));

  const segments = [];
  for (let i = 0; i < dataIndexed.length - 1; i++) {
    const a  = dataIndexed[i];
    const b  = dataIndexed[i + 1];
    if (!a.yLog || !b.yLog) continue;
    const x1 = scaleX(i);
    const y1 = scaleY(a.yLog);
    const x2 = scaleX(i + 1);
    const y2 = scaleY(b.yLog);
    const cx = (x1 + x2) / 2;
    segments.push({
      path:    `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      couleur: getCouleurCV(a.charge_virale_valeur),
    });
  }

  const ticksYLog = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000].filter(
    (v) => toLog(v) >= minLog - 0.2 && toLog(v) <= maxLog + 0.2
  );

  const maxTicksX = Math.min(4, dataIndexed.length);
  const ticksX = Array.from({ length: maxTicksX }, (_, i) => {
    const idx = Math.round((i / Math.max(maxTicksX - 1, 1)) * (dataIndexed.length - 1));
    return dataIndexed[Math.min(idx, dataIndexed.length - 1)];
  });

  const seuilY  = scaleY(SEUIL_INDETECTABLE);
  const lastIdx = dataIndexed.length - 1;

  const showLabel = (i) =>
    i === 0 || i === lastIdx || dataIndexed.length <= 7 || i % 2 === 0;
  const getLabelDy = (i) => {
    if (i === lastIdx && lastIdx % 2 !== 0) return -12;
    return i % 2 === 0 ? -12 : 14;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
        <Text style={styles.titre}>Évolution charge virale</Text>
        <Text style={styles.unite}>copies/mL</Text>
      </View>

      <View style={styles.legendeGroupe}>
        <View style={styles.legendeItem}>
          <View style={[styles.legendeLigne, { backgroundColor: COULEUR_OK }]} />
          <Text style={styles.legendeTexte}>Indétectable (&lt;{SEUIL_INDETECTABLE})</Text>
        </View>
        <View style={styles.legendeItem}>
          <View style={[styles.legendeLigne, { backgroundColor: COULEUR_CRIT }]} />
          <Text style={styles.legendeTexte}>Détectable</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollWrapper}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        <View style={styles.graphiqueWrapper}>
          <Svg width={SVG_W} height={SVG_H}>
            <Defs>
              <LinearGradient id="bgGradCV" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0F172A" stopOpacity="1" />
                <Stop offset="1" stopColor="#080D18" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="url(#bgGradCV)" rx={10} />

            {ticksYLog.map((v, i) => (
              <Line key={`grid-${i}`} x1={PAD_LEFT} y1={scaleY(v)} x2={SVG_W - PAD_RIGHT} y2={scaleY(v)}
                stroke={COULEUR_GRID} strokeWidth={1} strokeDasharray="4 4" />
            ))}
            {ticksYLog.map((v, i) => (
              <SvgText key={`ylabel-${i}`} x={PAD_LEFT - 5} y={scaleY(v) + 4}
                textAnchor="end" fontSize={9} fill={COULEUR_LABEL}>
                {formatVal(v)}
              </SvgText>
            ))}
            {ticksX.map((d, i) => (
              <SvgText key={`xlabel-${i}`} x={scaleX(d.index)} y={SVG_H - 8}
                textAnchor="middle" fontSize={9} fill={COULEUR_LABEL}>
                {formatDate(d.date)}
              </SvgText>
            ))}

            <Line x1={PAD_LEFT} y1={PAD_TOP + PLOT_H} x2={SVG_W - PAD_RIGHT} y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS} strokeWidth={1} />
            <Line x1={PAD_LEFT} y1={PAD_TOP} x2={PAD_LEFT} y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS} strokeWidth={1} />
            <Line x1={PAD_LEFT} y1={seuilY} x2={SVG_W - PAD_RIGHT} y2={seuilY}
              stroke={COULEUR_REF} strokeWidth={1.5} strokeDasharray="7 4" />

            {segments.map((seg, i) => (
              <Path key={`seg-${i}`} d={seg.path} stroke={seg.couleur}
                strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ))}

            {dataIndexed.map((d, i) => {
              if (!d.yLog) return null;
              const cx      = scaleX(i);
              const cy      = scaleY(d.yLog);
              const couleur = getCouleurCV(d.charge_virale_valeur);
              return (
                <React.Fragment key={`pt-${i}`}>
                  <Circle cx={cx} cy={cy} r={8}   fill={couleur} opacity={0.15} />
                  <Circle cx={cx} cy={cy} r={4.5} fill={couleur} stroke="#0F172A" strokeWidth={2} />
                  {showLabel(i) && (
                    <SvgText x={cx} y={cy + getLabelDy(i)} textAnchor="middle"
                      fontSize={9} fontWeight="bold" fill={couleur}>
                      {formatVal(d.charge_virale_valeur)}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>

      <View style={styles.refLegend}>
        <View style={styles.refLigneDash} />
        <Text style={styles.refTexte}>Seuil indétectable {SEUIL_INDETECTABLE} copies/mL</Text>
      </View>

      {Array.isArray(periodes) && periodes.length > 0 && (
        <View style={styles.traitements}>
          {periodes.map((periode, i) => (
            <View key={periode.medicament_id ?? i} style={styles.traitementItem}>
              <View style={styles.traitementDot} />
              <Text style={styles.traitementNom}>
                {periode.nom_medicament ?? periode.code_medicament}
              </Text>
              {!periode.date_fin && (
                <View style={styles.enCoursBadge}>
                  <Text style={styles.enCoursTexte}>en cours</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
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
  header:           { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8, flexWrap: "wrap" },
  dot:              { width: 10, height: 10, borderRadius: 5 },
  titre:            { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  unite:            { fontSize: 11, color: "#94A3B8" },
  legendeGroupe:    { flexDirection: "row", gap: 14, marginBottom: 10, flexWrap: "wrap" },
  legendeItem:      { flexDirection: "row", alignItems: "center", gap: 5 },
  legendeLigne:     { width: 18, height: 3, borderRadius: 2 },
  legendeTexte:     { fontSize: 11, color: "#555", fontWeight: "500" },
  scrollWrapper:    { borderRadius: 10, overflow: "hidden" },
  graphiqueWrapper: { borderRadius: 10, overflow: "hidden" },
  vide:             { padding: 40, alignItems: "center" },
  videTexte:        { color: "#94A3B8", fontSize: 13 },
  refLegend:        { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10 },
  refLigneDash:     { width: 22, height: 2, borderRadius: 1, backgroundColor: COULEUR_REF },
  refTexte:         { fontSize: 11, color: "#94A3B8" },
  traitements:      { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#F5F5F5", gap: 6 },
  traitementItem:   { flexDirection: "row", alignItems: "center", gap: 6 },
  traitementDot:    { width: 6, height: 6, borderRadius: 3, backgroundColor: "#1E40AF" },
  traitementNom:    { fontSize: 12, color: "#555", fontWeight: "500", flex: 1 },
  enCoursBadge:     { backgroundColor: "#2E7D32", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 1 },
  enCoursTexte:     { fontSize: 10, color: "#fff", fontWeight: "500" },

  // ── Accès fermé ──────────────────────────────────────────
  accesFerme: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
    marginTop: 4,
  },
  accesFermeIcon:  { fontSize: 32, marginBottom: 8 },
  accesFermeTitre: { fontSize: 14, fontWeight: "700", color: "#C2410C", marginBottom: 6 },
  accesFermeTexte: { fontSize: 12, color: "#9A3412", textAlign: "center", lineHeight: 18 },
});

export default ChargeViraleChart;