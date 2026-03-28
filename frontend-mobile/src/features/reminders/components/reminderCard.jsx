import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/reminders.styles';
import colors from '../../../constants/colors';

const TYPE_ICONS = {
  medicament: 'medkit',
  rendezvous: 'calendar',
  analyse: 'flask',
  autre: 'notifications',
};

const REPEAT_LABELS = {
  daily: 'Quotidien',
  weekly: 'Hebdomadaire',
  once: 'Une seule fois',
};

const ReminderCard = ({ reminder, onToggle, onDelete }) => {
  const iconName = TYPE_ICONS[reminder.type] || 'notifications';

  return (
    <View style={[styles.card, !reminder.isActive && styles.cardInactive]}>
      {/* Icon */}
      <View style={styles.cardIcon}>
        <Ionicons name={iconName} size={20} color={colors.primary} />
      </View>

      {/* Content */}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{reminder.title}</Text>
        <Text style={styles.cardTime}>{reminder.time}</Text>
        <Text style={styles.cardRepeat}>{REPEAT_LABELS[reminder.repeat]}</Text>
      </View>

      {/* Actions */}
      <View style={styles.cardActions}>
        <Switch
          value={reminder.isActive}
          onValueChange={() => onToggle(reminder.id)}
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={reminder.isActive ? colors.primary : colors.textLight}
        />
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(reminder.id)}
        >
          <Ionicons name="trash-outline" size={16} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ReminderCard;