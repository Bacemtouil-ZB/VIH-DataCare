import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/rendezvous.styles';
import colors from '../../../constants/colors';

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  // Extract date part only — ignore time and timezone
  const datePart = dateStr.split('T')[0]; // "2026-04-05"
  const [year, month, day] = datePart.split('-');
  const date = new Date(year, month - 1, day); // local date, no timezone shift
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const formatTime = (timeStr) => {
  if (!timeStr) return '';
  return timeStr.substring(0, 5);
};

const STATUS_CONFIG = {
  planifie: { label: 'Planifié', backgroundColor: '#EFF6FF', textColor: '#2563EB' },
  confirme: { label: 'Confirmé', backgroundColor: '#E8F5EE', textColor: '#1a6b4a' },
  annule: { label: 'Annulé', backgroundColor: '#FEF2F2', textColor: '#e74c3c' },
  termine: { label: 'Terminé', backgroundColor: '#F0FDF4', textColor: '#27ae60' },
};

const normalizeStatut = (statut) => {
  if (!statut) return '';
  return statut.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const RendezvousCard = ({ rendezvous, onPress }) => {
  if (!rendezvous) return null;
  console.log('raw date:', rendezvous.date);
  console.log('date part:', rendezvous.date.split('T')[0]);

  const key = normalizeStatut(rendezvous.statut);
  const statusConfig = STATUS_CONFIG[key] || {
    label: rendezvous.statut,
    backgroundColor: '#F3F4F6',
    textColor: '#6b7280',
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardDate}>{formatDate(rendezvous.date)}</Text>
          <Text style={styles.cardTime}>{formatTime(rendezvous.heure)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: statusConfig.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>
      <Text style={styles.cardType}>{rendezvous.type}</Text>
      <View style={styles.cardFooter}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="calendar-outline" size={14} color={colors.textLight} />
          <Text style={{ fontSize: 12, color: colors.textLight }}>
            Voir les détails
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );
};

export default RendezvousCard;