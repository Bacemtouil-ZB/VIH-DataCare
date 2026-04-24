import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import useReminders from "../hooks/useReminders";
import ReminderCard from "../components/reminderCard";
import styles from "../styles/reminders.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const RemindersListScreen = () => {
  const { t, isRTL } = useI18n();
  const { reminders, handleAdd, handleToggle, handleDelete } = useReminders();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.title")}
          </Text>
          <Text style={[styles.headerSubtitle, isRTL && { textAlign: "right" }]}>
            {t("reminders.configuredCount", { count: reminders.length })}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alarm-outline" size={48} color={colors.textLight} />
            <Text style={[styles.emptyText, isRTL && { textAlign: "right" }]}>
              {t("reminders.emptyTitle")}
            </Text>
            <Text style={[styles.emptySubtext, isRTL && { textAlign: "right" }]}>
              {t("reminders.emptySubtitle")}
            </Text>
          </View>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              reminder={reminder}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RemindersListScreen;
