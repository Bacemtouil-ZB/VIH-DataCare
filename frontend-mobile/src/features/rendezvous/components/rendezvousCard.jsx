import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/rendezvous.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";
import RendezvousStatusBadge from "./rendezvousStatusBadge";

const formatDate = (dateStr, locale) => {
  if (!dateStr) return "";

  const datePart = dateStr.split("T")[0];
  const [year, month, day] = datePart.split("-");
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return "";
  return timeStr.substring(0, 5);
};

const RendezvousCard = ({ rendezvous, onPress }) => {
  const { t, locale, isRTL } = useI18n();
  if (!rendezvous) return null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.cardDate, isRTL && { textAlign: "right" }]}>
            {formatDate(rendezvous.date, locale)}
          </Text>
          <Text style={[styles.cardTime, isRTL && { textAlign: "right" }]}>
            {formatTime(rendezvous.heure)}
          </Text>
        </View>
        <RendezvousStatusBadge statut={rendezvous.statut} />
      </View>
      <Text style={[styles.cardType, isRTL && { textAlign: "right" }]}>{rendezvous.type}</Text>
      <View style={styles.cardFooter}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
          <Text style={{ fontSize: 12, color: colors.textLight }}>
            {t("rendezvous.viewDetails")}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

export default RendezvousCard;
