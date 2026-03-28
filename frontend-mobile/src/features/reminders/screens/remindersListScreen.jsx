import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import useReminders from '../hooks/useReminders';
import ReminderCard from '../components/ReminderCard';
import styles from '../styles/reminders.styles';
import colors from '../../../constants/colors';

const RemindersListScreen = () => {
  const { reminders, isLoading, handleAdd, handleToggle, handleDelete } = useReminders();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Mes Rappels</Text>
          <Text style={styles.headerSubtitle}>
            {reminders.length} rappel{reminders.length !== 1 ? 's' : ''} configuré{reminders.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Ionicons name="add" size={24} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="alarm-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Aucun rappel configuré</Text>
            <Text style={styles.emptySubtext}>
              Appuyez sur + pour ajouter un rappel
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