import React, { useMemo } from "react";
import { Dimensions, ScrollView, Text, View } from "react-native";
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
import styles from "../styles/cd4Chart.styles";

const SEUIL_CRITIQUE = 200;
const COULEUR_OK = "#22C55E";
const COULEUR_CRIT = "#EF4444";
const COULEUR_REF = "#F59E0B";
const COULEUR_GRID = "#1E293B";
const COULEUR_AXIS = "#334155";
const COULEUR_LABEL = "#94A3B8";

const getCouleurCD4 = (valeur) => {
  if (valeur == null) return COULEUR_OK;
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

const CD4Chart = ({ data = [], periodes = [], authorized = true }) => {
  const { t } = useI18n();
  if (!authorized) return null;

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
      };
    });
  }, [safeData, safePeriodes]);

  const MIN_POINT_SPACING = 60;
  const SVG_W = Math.max(screenWidth - 32, dataEnrichie.length * MIN_POINT_SPACING + 64);
  const SVG_H = 230;
  const PAD_LEFT = 46;
  const PAD_RIGHT = 18;
  const PAD_TOP = 24;
  const PAD_BOTTOM = 38;
  const PLOT_W = SVG_W - PAD_LEFT - PAD_RIGHT;
  const PLOT_H = SVG_H - PAD_TOP - PAD_BOTTOM;

  if (dataEnrichie.length === 0) {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.dot, { backgroundColor: "#6366F1" }]} />
          <Text style={styles.title}>{t("suivi.chartCd4Title")}</Text>
          <Text style={styles.unit}>{t("suivi.chartCd4Unit")}</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>{t("suivi.noData")}</Text>
        </View>
      </View>
    );
  }

  const valeurs = dataEnrichie.map((item) => item.y).filter((value) => value != null);
  const minVal = Math.min(...valeurs, SEUIL_CRITIQUE);
  const maxVal = Math.max(...valeurs, SEUIL_CRITIQUE);
  const padY = Math.max((maxVal - minVal) * 0.28, 60);
  const domainMin = Math.max(0, minVal - padY);
  const domainMax = maxVal + padY;

  const scaleX = (index) =>
    PAD_LEFT +
    (dataEnrichie.length === 1 ? PLOT_W / 2 : (index / (dataEnrichie.length - 1)) * PLOT_W);

  const scaleY = (value) =>
    PAD_TOP + PLOT_H - ((value - domainMin) / (domainMax - domainMin)) * PLOT_H;

  const dataIndexed = dataEnrichie.map((item, index) => ({ ...item, index }));

  const segments = [];
  for (let i = 0; i < dataIndexed.length - 1; i += 1) {
    const a = dataIndexed[i];
    const b = dataIndexed[i + 1];

    if (a.y == null || b.y == null) continue;

    const x1 = scaleX(i);
    const y1 = scaleY(a.y);
    const x2 = scaleX(i + 1);
    const y2 = scaleY(b.y);
    const cx = (x1 + x2) / 2;

    segments.push({
      path: `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2} ${y2}`,
      color: getCouleurCD4(a.cd4_absolu),
    });
  }

  const ticksY = Array.from({ length: 5 }, (_, i) => {
    const value = domainMin + (i / 4) * (domainMax - domainMin);
    return { value: Math.round(value), y: scaleY(value) };
  });

  const maxTicksX = Math.min(4, dataIndexed.length);
  const ticksX = Array.from({ length: maxTicksX }, (_, i) => {
    const idx = Math.round((i / Math.max(maxTicksX - 1, 1)) * (dataIndexed.length - 1));
    return dataIndexed[Math.min(idx, dataIndexed.length - 1)];
  });

  const seuilY = scaleY(SEUIL_CRITIQUE);
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
        <View style={[styles.dot, { backgroundColor: "#6366F1" }]} />
        <Text style={styles.title}>{t("suivi.chartCd4Title")}</Text>
        <Text style={styles.unit}>{t("suivi.chartCd4Unit")}</Text>
      </View>

      <View style={styles.legendGroup}>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: COULEUR_OK }]} />
          <Text style={styles.legendText}>
            {t("suivi.cd4Normal", { threshold: SEUIL_CRITIQUE })}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, { backgroundColor: COULEUR_CRIT }]} />
          <Text style={styles.legendText}>
            {t("suivi.cd4Critical", { threshold: SEUIL_CRITIQUE })}
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollWrapper}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.graphWrapper}>
          <Svg width={SVG_W} height={SVG_H}>
            <Defs>
              <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#0F172A" stopOpacity="1" />
                <Stop offset="1" stopColor="#080D18" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            <Rect x={0} y={0} width={SVG_W} height={SVG_H} fill="url(#bgGrad)" rx={10} />

            {ticksY.map((tick, i) => (
              <Line
                key={`grid-${i}`}
                x1={PAD_LEFT}
                y1={tick.y}
                x2={SVG_W - PAD_RIGHT}
                y2={tick.y}
                stroke={COULEUR_GRID}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            ))}

            {ticksY.map((tick, i) => (
              <SvgText
                key={`ylabel-${i}`}
                x={PAD_LEFT - 5}
                y={tick.y + 4}
                textAnchor="end"
                fontSize={9}
                fill={COULEUR_LABEL}
              >
                {formatVal(tick.value)}
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
              if (item.y == null) return null;

              const cx = scaleX(i);
              const cy = scaleY(item.y);
              const color = getCouleurCD4(item.cd4_absolu);

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
                      {formatVal(item.cd4_absolu)}
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
          {t("suivi.cd4CriticalThreshold", { threshold: SEUIL_CRITIQUE })}
        </Text>
      </View>
    </View>
  );
};

export default CD4Chart;
