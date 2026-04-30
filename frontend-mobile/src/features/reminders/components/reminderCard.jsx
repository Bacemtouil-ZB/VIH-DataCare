import React from "react";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/reminders.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const TYPE_ICONS = {
  medicament: "medkit",
  rendezvous: "calendar",
  analyse: "flask",
  autre: "notifications",
};

const REPEAT_LABEL_KEYS = {
  daily: "reminders.repeatDailyLong",
  weekly: "reminders.repeatWeeklyLong",
  once: "reminders.repeatOnceLong",
};

const ReminderCard = ({ reminder, onToggle, onDelete }) => {
  const { t, isRTL } = useI18n();
  const iconName = TYPE_ICONS[reminder.type] || "notifications";

  return (
    <View style={[styles.card, !reminder.isActive && styles.cardInactive]}>
      <View style={styles.cardIcon}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
      </View>

      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, isRTL && { textAlign: "right" }]}>{reminder.title}</Text>
        <Text style={[styles.cardTime, isRTL && { textAlign: "right" }]}>{reminder.time}</Text>
        <Text style={[styles.cardRepeat, isRTL && { textAlign: "right" }]}>
          {t(REPEAT_LABEL_KEYS[reminder.repeat] || "reminders.repeatOnceLong")}
        </Text>
      </View>

      <View style={styles.cardActions}>
        <Switch
          value={reminder.isActive}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={reminder.isActive ? colors.primary : colors.textLight}
        />
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(reminder.id)}>
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReminderCard;
