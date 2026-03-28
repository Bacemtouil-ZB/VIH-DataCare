import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/home.styles';
import colors from '../../../constants/colors';

const getCountdownText = (dateStr) => {
  if (!dateStr) return '';
  const datePart = dateStr.split('T')[0];
  const [year, month, day] = datePart.split('-');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const apptDate = new Date(year, month - 1, day);
  const diffTime = apptDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return 'Demain';
  if (diffDays > 1) return `Dans ${diffDays} jours`;
  return 'Passé';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const datePart = dateStr.split('T')[0];
  const [year, month, day] = datePart.split('-');
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const NextAppointmentBanner = ({ rendezvous }) => {
  const navigation = useNavigation();

  if (!rendezvous) {
    return (
      <View style={styles.bannerEmpty}>
        <Ionicons name="calendar-outline" size={32} color={colors.textLight} />
        <Text style={styles.bannerEmptyText}>Aucun rendez-vous à venir</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Rendezvous', {
        screen: 'RendezvousDetail',
        params: { id: rendezvous.id }
      })}
    >
      <View style={styles.bannerContainer}>
        <View style={styles.bannerRow}>
          <View style={styles.bannerIcon}>
            <Ionicons name="calendar" size={22} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerDate}>{formatDate(rendezvous.date)}</Text>
            <Text style={styles.bannerTime}>{rendezvous.heure?.substring(0, 5)}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </View>
        <View style={styles.bannerCountdown}>
          <Text style={styles.bannerCountdownText}>
            {getCountdownText(rendezvous.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NextAppointmentBanner;