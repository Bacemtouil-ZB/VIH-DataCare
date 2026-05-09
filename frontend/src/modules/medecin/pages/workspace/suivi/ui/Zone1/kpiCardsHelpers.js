import {
  formatCD4,
  formatCV,
  formatCreatinine,
  formatDate,
  getCD4HexColor,
  getCreatinineAntColor,
  getCVAntColor,
  getHBVHexColor,
} from "../../helpers/suiviHelpers";
import {
  COULEURS_STATUT_HEX,
  MESSAGES_VIDES,
  STATUTS,
  UNITES,
} from "../../constants/suiviConstants";

const getHexByAntColor = (colorKey) => {
  if (colorKey === "success") return COULEURS_STATUT_HEX[STATUTS.BON];
  if (colorKey === "warning") return COULEURS_STATUT_HEX[STATUTS.MOYEN];
  if (colorKey === "error") return COULEURS_STATUT_HEX[STATUTS.CRITIQUE];
  return COULEURS_STATUT_HEX[STATUTS.INCONNU];
};

export const getTrendState = (currentValue, previousValue, inverse = false) => {
  if (currentValue == null || previousValue == null) return null;
  if (currentValue === previousValue) return { direction: "flat", positive: false };

  const rising = currentValue > previousValue;
  return {
    direction: rising ? "up" : "down",
    positive: inverse ? !rising : rising,
  };
};

const buildCommonRows = (metric, formatter, inverse = false) => [
  metric?.date && {
    kind: "calendar",
    label: "Mesure",
    value: formatDate(metric.date),
  },
  metric?.precedent != null && {
    kind: "trend",
    label: "Préc.",
    value: formatter(metric.precedent),
    trend: getTrendState(metric.valeur, metric.precedent, inverse),
  },
].filter(Boolean);

export const buildKpiCardsData = (kpis) => {
  if (!kpis) return [];

  const hbv = kpis.serologie_hbv;

  const cards = [
    {
      key: "cd4",
      icon: "heart",
      iconColor: "#2563EB",
      iconBg: "#DBEAFE",
      label: "CD4",
      value: formatCD4(kpis.cd4?.valeur),
      valueColor: getCD4HexColor(kpis.cd4?.valeur),
      unit: UNITES.CD4,
      percent: kpis.cd4?.pourcent,
      rows: buildCommonRows(kpis.cd4, formatCD4),
    },
    {
      key: "cv",
      icon: "thunderbolt",
      iconColor: "#DC2626",
      iconBg: "#FEE2E2",
      label: "Charge virale",
      value: formatCV(kpis.cv?.valeur),
      valueColor: getHexByAntColor(getCVAntColor(kpis.cv?.valeur)),
      unit: kpis.cv?.valeur >= 200 ? UNITES.CV : "",
      rows: buildCommonRows(kpis.cv, formatCV, true),
    },
    {
      key: "creatinine",
      icon: "experiment",
      iconColor: "#059669",
      iconBg: "#D1FAE5",
      label: "Créatinine",
      value: formatCreatinine(kpis.creatinine?.valeur),
      valueColor: getHexByAntColor(getCreatinineAntColor(kpis.creatinine?.valeur)),
      unit: UNITES.CREATININE,
      rows: buildCommonRows(kpis.creatinine, formatCreatinine),
    },
  ];

  if (hbv) {
    cards.push(
      {
        key: "hbv-aghbs",
        icon: "medicine",
        iconColor: "#DC2626",
        iconBg: "#FEE2E2",
        label: "AgHBs",
        value: hbv.ag_hbs ?? "—",
        valueColor: getHBVHexColor("ag_hbs", hbv.ag_hbs),
        rows: hbv.date
          ? [{ kind: "calendar", label: "Mesure", value: formatDate(hbv.date) }]
          : [],
      },
      {
        key: "hbv-antihbs",
        icon: "medicine",
        iconColor: "#059669",
        iconBg: "#D1FAE5",
        label: "Anti-HBs",
        value: hbv.anti_hbs ?? "—",
        valueColor: getHBVHexColor("anti_hbs", hbv.anti_hbs),
        rows: hbv.date
          ? [{ kind: "calendar", label: "Mesure", value: formatDate(hbv.date) }]
          : [],
      },
      {
        key: "hbv-antihbc",
        icon: "medicine",
        iconColor: "#D97706",
        iconBg: "#FEF3C7",
        label: "Anti-HBc",
        value: hbv.anti_hbc ?? "—",
        valueColor: getHBVHexColor("anti_hbc", hbv.anti_hbc),
        rows: hbv.date
          ? [{ kind: "calendar", label: "Mesure", value: formatDate(hbv.date) }]
          : [],
      }
    );
  }

  return cards;
};

export const getEmptyKpisMessage = () => MESSAGES_VIDES.kpis;
