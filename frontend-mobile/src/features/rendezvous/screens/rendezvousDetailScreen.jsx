import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import rendezvousApi from "../../../api/rendezvous.api";
import RendezvousStatusBadge from "../components/rendezvousStatusBadge";
import styles from "../styles/rendezvous.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

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

const RendezvousDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;
  const { t, locale, isRTL } = useI18n();

  const [rendezvous, setRendezvous] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await rendezvousApi.getRendezvousDetail(id);
        setRendezvous(data.rendezvous);
      } catch (err) {
        setError(err.response?.data?.message || t("errors.rendezvousLoad"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id, t]);

  return (
    <SafeAreaView style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={[styles.detailHeaderTitle, isRTL && { textAlign: "right" }]}>
          {t("rendezvous.detailTitle")}
        </Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={[styles.errorText, isRTL && { textAlign: "right" }]}>{error}</Text>
        </View>
      ) : !rendezvous ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
          <Text style={[styles.emptyText, isRTL && { textAlign: "right" }]}>
            {t("rendezvous.notFound")}
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.detailContent}>
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailLabel, isRTL && { textAlign: "right" }]}>
                {t("rendezvous.dateLabel")}
              </Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: "right" }]}>
                {formatDate(rendezvous.date, locale)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailLabel, isRTL && { textAlign: "right" }]}>
                {t("rendezvous.timeLabel")}
              </Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: "right" }]}>
                {formatTime(rendezvous.heure)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailLabel, isRTL && { textAlign: "right" }]}>
                {t("rendezvous.typeLabel")}
              </Text>
              <Text style={[styles.detailValue, isRTL && { textAlign: "right" }]}>
                {rendezvous.type}
              </Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Ionicons name="flag-outline" size={18} color={colors.primary} />
              <Text style={[styles.detailLabel, isRTL && { textAlign: "right" }]}>
                {t("rendezvous.statusLabel")}
              </Text>
              <RendezvousStatusBadge statut={rendezvous.statut} />
            </View>
          </View>

          {rendezvous.commentaire ? (
            <View style={styles.commentaireBox}>
              <Text style={[styles.commentaireTitle, isRTL && { textAlign: "right" }]}>
                {t("rendezvous.commentLabel")}
              </Text>
              <Text style={[styles.commentaireText, isRTL && { textAlign: "right" }]}>
                {rendezvous.commentaire}
              </Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default RendezvousDetailScreen;
