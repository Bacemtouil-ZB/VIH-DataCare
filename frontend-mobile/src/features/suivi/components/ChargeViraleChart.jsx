import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, {
  Circle,
  Defs,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";
import useI18n from "../../../i18n/useI18n";

const SEUIL_INDETECTABLE = 200;
const COULEUR_OK = "#22C55E";
const COULEUR_CRIT = "#EF4444";
const COULEUR_REF = "#F59E0B";
const COULEUR_GRID = "#1E293B";
const COULEUR_AXIS = "#334155";
const COULEUR_LABEL = "#94A3B8";

const getCouleurCV = (valeur) => {
  if (valeur == null) return COULEUR_OK;
  if (valeur < SEUIL_INDETECTABLE) return COULEUR_OK;
  return COULEUR_CRIT;
};

const formatVal = (v) => {
  if (v == null) return "";
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `${Math.round(v / 1_000)}k`;
  return Math.round(v).toString();
};

const formatDate = (dateRaw) => {
  if (!dateRaw) return "";

  try {
    const str = String(dateRaw);
    const isoMatch = str.match(/^(\d{4})-(\d{2})-(\d{2})/);

    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }

    const date = new Date(str);
    if (Number.isNaN(date.getTime())) return str;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return String(dateRaw);
  }
};

const toLog = (v) => Math.log10(Math.max(v, 1));

const ChargeViraleChart = ({ data = [], periodes = [], authorized = true }) => {
  const { t } = useI18n();

  const screenWidth = Dimensions.get("window").width;
  const safeData = Array.isArray(data) ? data : [];
  const safePeriodes = Array.isArray(periodes) ? periodes : [];

  const dataEnrichie = useMemo(() => {
    return safeData.map((point) => {
      const periode = safePeriodes.find((item) => {
        const debut = new Date(item.date_debut);
        const fin = item.date_fin ? new Date(item.date_fin) : new Date();
        const date = new Date(point.date);
        return date >= debut && date <= fin;
      });

      return {
        ...point,
        traitement: periode?.nom_medicament ?? periode?.code_medicament ?? null,
        yLog: point.charge_virale_valeur > 0 ? point.charge_virale_valeur : 1,
      };
    });
  }, [safeData, safePeriodes]);

  const MIN_POINT_SPACING = 60;
  const SVG_W = Math.max(screenWidth - 32, safeData.length * MIN_POINT_SPACING + 64);
  const SVG_H = 230;
  const PAD_LEFT = 46;
  const PAD_RIGHT = 18;
  const PAD_TOP = 24;
  const PAD_BOTTOM = 38;
  const PLOT_W = SVG_W - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

  if (!authorized) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
          <Text style={styles.title}>{t("suivi.chartViralTitle")}</Text>
          <Text style={styles.unit}>{t("suivi.chartViralUnit")}</Text>
        </View>
        <View style={styles.accessDenied}>
          <Text style={styles.accessDeniedIcon}>🔒</Text>
          <Text style={styles.accessDeniedTitle}>{t("suivi.accessDeniedTitle")}</Text>
          <Text style={styles.accessDeniedText}>{t("suivi.accessDeniedMessage")}</Text>
        </View>
      </View>
    );
  }

  if (safeData.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
          <Text style={styles.title}>{t("suivi.chartViralTitle")}</Text>
          <Text style={styles.unit}>{t("suivi.chartViralUnit")}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("suivi.noData")}</Text>
        </View>
      </View>
    );
  }

  const valeursLog = dataEnrichie.map((item) => item.yLog).filter((value) => value > 0);
  const minLog = toLog(Math.min(...valeursLog, SEUIL_INDETECTABLE));
  const maxLog = toLog(Math.max(...valeursLog, SEUIL_INDETECTABLE)) + 0.5;

  const scaleX = (index) =>
    PAD_LEFT +
    (dataEnrichie.length === 1 ? PLOT_W / 2 : (index / (dataEnrichie.length - 1)) * PLOT_W);

  const scaleY = (value) => {
    const logValue = toLog(Math.max(value, 1));
    return PAD_TOP + PLOT_H - ((logValue - minLog) / (maxLog - minLog)) * PLOT_H;
  };

  const dataIndexed = dataEnrichie.map((item, index) => ({ ...item, index }));

  const segments = [];
  for (let i = 0; i < dataIndexed.length - 1; i += 1) {
    const a = dataIndexed[i];
    const b = dataIndexed[i + 1];
    if (!a.yLog || !b.yLog) continue;

    const x1 = scaleX(i);
    const y1 = scaleY(a.yLog);
    const x2 = scaleX(i + 1);
    const y2 = scaleY(b.yLog);
    const cx = (x1 + x2) / 2;

    segments.push({
      path: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      color: getCouleurCV(a.charge_virale_valeur),
    });
  }

  const ticksYLog = [1, 10, 100, 1_000, 10_000, 100_000, 1_000_000].filter(
    (value) => toLog(value) >= minLog - 0.2 && toLog(value) <= maxLog + 0.2
  );

  const maxTicksX = Math.min(4, dataIndexed.length);
  const ticksX = Array.from({ length: maxTicksX }, (_, i) => {
    const idx = Math.round((i / Math.max(maxTicksX - 1, 1)) * (dataIndexed.length - 1));
    return dataIndexed[Math.min(idx, dataIndexed.length - 1)];
  });

  const seuilY = scaleY(SEUIL_INDETECTABLE);
  const lastIdx = dataIndexed.length - 1;
  const showLabel = (index) =>
    index === 0 || index === lastIdx || dataIndexed.length <= 7 || index % 2 === 0;
  const getLabelDy = (index) => {
    if (index === lastIdx && lastIdx % 2 !== 0) return -12;
    return index % 2 === 0 ? -12 : 14;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: "#8B5CF6" }]} />
        <Text style={styles.title}>{t("suivi.chartViralTitle")}</Text>
        <Text style={styles.unit}>{t("suivi.chartViralUnit")}</Text>
      </View>

      <View style={styles.legendGroup}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: COULEUR_OK }]} />
          <Text style={styles.legendText}>
            {t("suivi.viralUndetectable", { threshold: SEUIL_INDETECTABLE })}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: COULEUR_CRIT }]} />
          <Text style={styles.legendText}>{t("suivi.viralDetectable")}</Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollWrapper}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        <View style={styles.graphWrapper}>
          <Svg width={SVG_W} height={SVG_H}>
            <Defs>
              <LinearGradient id="bgGradCV" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0F172A" stopOpacity="1" />
                <Stop offset="1" stopColor="#080D18" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="url(#bgGradCV)" rx={10} />

            {ticksYLog.map((value, i) => (
              <Line
                key={`grid-${i}`}
                x1={PAD_LEFT}
                y1={scaleY(value)}
                x2={SVG_W - PAD_RIGHT}
                y2={scaleY(value)}
                stroke={COULEUR_GRID}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {ticksYLog.map((value, i) => (
              <SvgText
                key={`ylabel-${i}`}
                x={PAD_LEFT - 5}
                y={scaleY(value) + 4}
                textAnchor="end"
                fontSize={9}
                fill={COULEUR_LABEL}
              >
                {formatVal(value)}
              </SvgText>
            ))}

            {ticksX.map((item, i) => (
              <SvgText
                key={`xlabel-${i}`}
                x={scaleX(item.index)}
                y={SVG_H - 8}
                textAnchor="middle"
                fontSize={9}
                fill={COULEUR_LABEL}
              >
                {formatDate(item.date)}
              </SvgText>
            ))}

            <Line
              x1={PAD_LEFT}
              y1={PAD_TOP + PLOT_H}
              x2={SVG_W - PAD_RIGHT}
              y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS}
              strokeWidth={1}
            />
            <Line
              x1={PAD_LEFT}
              y1={PAD_TOP}
              x2={PAD_LEFT}
              y2={PAD_TOP + PLOT_H}
              stroke={COULEUR_AXIS}
              strokeWidth={1}
            />
            <Line
              x1={PAD_LEFT}
              y1={seuilY}
              x2={SVG_W - PAD_RIGHT}
              y2={seuilY}
              stroke={COULEUR_REF}
              strokeWidth={1.5}
              strokeDasharray="7 4"
            />

            {segments.map((segment, i) => (
              <Path
                key={`seg-${i}`}
                d={segment.path}
                stroke={segment.color}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}

            {dataIndexed.map((item, i) => {
              if (!item.yLog) return null;

              const cx = scaleX(i);
              const cy = scaleY(item.yLog);
              const color = getCouleurCV(item.charge_virale_valeur);

              return (
                <React.Fragment key={`pt-${i}`}>
                  <Circle cx={cx} cy={cy} r={8} fill={color} opacity={0.15} />
                  <Circle cx={cx} cy={cy} r={4.5} fill={color} stroke="#0F172A" strokeWidth={2} />
                  {showLabel(i) ? (
                    <SvgText
                      x={cx}
                      y={cy + getLabelDy(i)}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight="bold"
                      fill={color}
                    >
                      {formatVal(item.charge_virale_valeur)}
                    </SvgText>
                  ) : null}
                </React.Fragment>
              );
            })}
          </Svg>
        </View>
      </ScrollView>

      <View style={styles.refLegend}>
        <View style={styles.refDash} />
        <Text style={styles.refText}>
          {t("suivi.viralUndetectableThreshold", { threshold: SEUIL_INDETECTABLE })}
        </Text>
      </View>

      {safePeriodes.length > 0 ? (
        <View style={styles.traitements}>
          {safePeriodes.map((periode, i) => (
            <View key={periode.medicament_id ?? i} style={styles.traitementItem}>
              <View style={styles.traitementDot} />
              <Text style={styles.traitementNom}>
                {periode.nom_medicament ?? periode.code_medicament}
              </Text>
              {!periode.date_fin ? (
                <View style={styles.enCoursBadge}>
                  <Text style={styles.enCoursText}>{t("suivi.inProgress")}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

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
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
  },
  unit: {
    fontSize: 11,
    color: "#94A3B8",
  },
  legendGroup: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  legendLine: {
    width: 18,
    height: 3,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 11,
    color: "#555",
    fontWeight: "500",
  },
  scrollWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  graphWrapper: {
    borderRadius: 10,
    overflow: "hidden",
  },
  empty: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 13,
  },
  refLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  refDash: {
    width: 22,
    height: 2,
    borderRadius: 1,
    backgroundColor: COULEUR_REF,
  },
  refText: {
    fontSize: 11,
    color: "#94A3B8",
  },
  traitements: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
    gap: 6,
  },
  traitementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  traitementDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#1E40AF",
  },
  traitementNom: {
    fontSize: 12,
    color: "#555",
    fontWeight: "500",
    flex: 1,
  },
  enCoursBadge: {
    backgroundColor: "#2E7D32",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  enCoursText: {
    fontSize: 10,
    color: "#fff",
    fontWeight: "500",
  },
  accessDenied: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "#FFF7ED",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FED7AA",
    marginTop: 4,
  },
  accessDeniedIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  accessDeniedTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#C2410C",
    marginBottom: 6,
  },
  accessDeniedText: {
    fontSize: 12,
    color: "#9A3412",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default ChargeViraleChart;
