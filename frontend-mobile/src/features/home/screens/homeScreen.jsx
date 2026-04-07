import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import useAuthStore from '../../../store/authStore';
import NextAppointmentBanner from '../components/nextAppointmentBanner';
import TodayRemindersList from '../components/todayRemindersList';
import rendezvousApi from '../../../api/rendezvous.api';
import useReminderStore from '../../../store/reminderStore';
import styles from '../styles/home.styles';
import colors from '../../../constants/colors';
import useNotifications from '../../../hooks/useNotifications';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bonjour';
  if (hour < 18) return 'Bon après-midi';
  return 'Bonsoir';
};

const getTodayReminders = (reminders) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentDay = now.getDay();

  return reminders.filter(reminder => {
    if (!reminder.isActive) return false;
    if (reminder.repeat === 'daily') return true;
    if (reminder.repeat === 'weekly') return reminder.weekday === currentDay;
    if (reminder.repeat === 'once') {
      const [h, m] = reminder.time.split(':').map(Number);
      return h > currentHour || (h === currentHour && m > currentMinute);
    }
    return true;
  });
};

const HomeScreen = () => {
  useNotifications();
  const { user, logout } = useAuthStore();
  const { reminders } = useReminderStore();
  const navigation = useNavigation();
  const [nextRendezvous, setNextRendezvous] = useState(null);

  const todayReminders = getTodayReminders(reminders);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const data = await rendezvousApi.getRendezvous();
        const upcoming = data.rendezvous
          .filter(r => {
            const datePart = r.date.split('T')[0];
            const [year, month, day] = datePart.split('-');
            const rdvDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return rdvDate >= today;
          })
          .sort((a, b) =>
            new Date(a.date.split('T')[0]) - new Date(b.date.split('T')[0])
          );
        setNextRendezvous(upcoming[0] || null);
      } catch {
        setNextRendezvous(null);
      }
    };
    fetchNext();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.patientName}>
                {user?.name} {user?.surname}
              </Text>
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Ionicons name="log-out-outline" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.numeroText}>N° {user?.numero}</Text>
        </View>

        {/* 2 Boutons actions */}
        <View style={styles.actionsRow}>

          {/* Dashboard */}
          <TouchableOpacity
            style={styles.actionButtonDashboard}
            onPress={() => navigation.navigate('Suivi')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="stats-chart-outline" size={22} color={colors.primary} />
            </View>
            <Text style={styles.actionButtonText}>Mon suivi</Text>
            <Text style={styles.actionButtonSub}>Courbes & résultats</Text>
          </TouchableOpacity>

          {/* Urgence */}
          <TouchableOpacity
            style={styles.actionButtonUrgence}
            onPress={() => navigation.navigate('Urgence')}
          >
            <View style={styles.actionIconUrgence}>
              <Ionicons name="call-outline" size={22} color={colors.white} />
            </View>
            <Text style={styles.actionButtonTextUrgence}>Urgence</Text>
            <Text style={styles.actionButtonSubUrgence}>Appel immédiat</Text>
          </TouchableOpacity>

        </View>

        {/* Next Appointment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prochain rendez-vous</Text>
          <NextAppointmentBanner rendezvous={nextRendezvous} />
        </View>

        {/* Today Reminders */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rappels du jour</Text>
          <TodayRemindersList reminders={todayReminders} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;