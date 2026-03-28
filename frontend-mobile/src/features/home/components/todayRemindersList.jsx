import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/home.styles';
import colors from '../../../constants/colors';

const ReminderItem = ({ reminder }) => (
  <View style={styles.reminderCard}>
    <View style={styles.reminderIcon}>
      <Ionicons name="alarm-outline" size={20} color={colors.primary} />
    </View>
    <View>
      <Text style={styles.reminderTitle}>{reminder.title}</Text>
      <Text style={styles.reminderTime}>{reminder.time}</Text>
    </View>
  </View>
);

const TodayRemindersList = ({ reminders }) => {
  if (!reminders || reminders.length === 0) {
    return (
      <View style={styles.emptyReminders}>
        <Ionicons name="alarm-outline" size={32} color={colors.textLight} />
        <Text style={styles.emptyRemindersText}>Aucun rappel pour aujourd'hui</Text>
      </View>
    );
  }

  return (
    <View>
      {reminders.map((reminder) => (
        <ReminderItem key={reminder.id} reminder={reminder} />
      ))}
    </View>
  );
};

export default TodayRemindersList;