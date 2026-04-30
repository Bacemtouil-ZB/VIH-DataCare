import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/home.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const ReminderItem = ({ reminder, isRTL }) => (
  <View style={styles.reminderCard}>
    <View style={styles.reminderIcon}>
      <Ionicons name="alarm-outline" size={20} color={colors.primary} />
    </View>
    <View>
      <Text style={[styles.reminderTitle, isRTL && { textAlign: "right" }]}>
        {reminder.title}
      </Text>
      <Text style={[styles.reminderTime, isRTL && { textAlign: "right" }]}>
        {reminder.time}
      </Text>
    </View>
  </View>
);

const TodayRemindersList = ({ reminders }) => {
  const { t, isRTL } = useI18n();

  if (!reminders || reminders.length === 0) {
    return (
      <View style={styles.emptyReminders}>
        <Ionicons name="alarm-outline" size={32} color={colors.textLight} />
        <Text style={[styles.emptyRemindersText, isRTL && { textAlign: "right" }]}>
          {t("home.noReminderToday")}
        </Text>
      </View>
    );
  }

  return (
    <View>
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} isRTL={isRTL} />
      ))}
    </View>
  );
};

export default TodayRemindersList;
