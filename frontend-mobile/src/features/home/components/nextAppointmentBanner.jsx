import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/home.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";


// displays the next upcoming appointment (rendezvous) for the user. 
const getCountdownText = (dateStr, t) => {
  if (!dateStr) return "";

  const datePart = dateStr.split("T")[0];
  const [year, month, day] = datePart.split("-");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(year, month - 1, day);
  const diffTime = apptDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return t("home.countdownToday");
  if (diffDays === 1) return t("home.countdownTomorrow");
  if (diffDays > 1) return t("home.countdownInDays", { count: diffDays });
  return t("home.countdownPast");
};

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

const NextAppointmentBanner = ({ rendezvous }) => {
  const navigation = useNavigation();
  const { t, locale, isRTL } = useI18n();

  if (!rendezvous) {
    return (
      <View style={styles.bannerEmpty}>
        <Ionicons name="calendar-outline" size={32} color={colors.textLight} />
        <Text style={[styles.bannerEmptyText, isRTL && { textAlign: "right" }]}>
          {t("home.noUpcomingAppointment")}
        </Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() =>
        navigation.navigate("Rendezvous", {
          screen: "RendezvousDetail",
          params: { id: rendezvous.id },
        })
      }
    >
      <View style={styles.bannerContainer}>
        <View style={styles.bannerRow}>
          <View style={styles.bannerIcon}>
            <Ionicons name="calendar" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.bannerDate, isRTL && { textAlign: "right" }]}>
              {formatDate(rendezvous.date, locale)}
            </Text>
            <Text style={[styles.bannerTime, isRTL && { textAlign: "right" }]}>
              {rendezvous.heure?.substring(0, 5)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.bannerCountdown}>
          <Text style={styles.bannerCountdownText}>
            {getCountdownText(rendezvous.date, t)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NextAppointmentBanner;
