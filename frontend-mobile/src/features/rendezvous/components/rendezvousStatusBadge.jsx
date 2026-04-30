import React from "react";
import { Text, View } from "react-native";
import styles from "../styles/rendezvous.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const normalizeStatus = (status) =>
  status
    ?.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const getStatusTranslationKey = (normalizedStatus) => {
  switch (normalizedStatus) {
    case "planifie":
      return "rendezvous.statusPlanifie";
    case "confirme":
      return "rendezvous.statusConfirme";
    case "annule":
      return "rendezvous.statusAnnule";
    case "termine":
      return "rendezvous.statusTermine";
    default:
      return null;
  }
};

const STATUS_STYLE = {
  planifie: {
    backgroundColor: "#EFF6FF",
    textColor: "#2563EB",
  },
  confirme: {
    backgroundColor: colors.primaryLight,
    textColor: colors.primary,
  },
  annule: {
    backgroundColor: "#FEF2F2",
    textColor: colors.danger,
  },
  termine: {
    backgroundColor: "#F0FDF4",
    textColor: colors.success,
  },
};

const RendezvousStatusBadge = ({ statut }) => {
  const { t } = useI18n();

  const key = normalizeStatus(statut);
  const styleConfig = STATUS_STYLE[key] || {
    backgroundColor: colors.borderLight,
    textColor: colors.textSecondary,
  };
  const translationKey = getStatusTranslationKey(key);
  const label = translationKey ? t(translationKey) : statut;

  return (
    <View style={[styles.badge, { backgroundColor: styleConfig.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: styleConfig.textColor }]}>{label}</Text>
    </View>
  );
};

export default RendezvousStatusBadge;
