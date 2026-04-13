import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import rendezvousApi from '../../../api/rendezvous.api';
import RendezvousStatusBadge from '../components/rendezvousStatusBadge';
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

const RendezvousDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  const [rendezvous, setRendezvous] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await rendezvousApi.getRendezvousDetail(id);
        setRendezvous(data.rendezvous);
      } catch (err) {
        setError(err.response?.data?.message || 'Erreur de chargement');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <SafeAreaView style={styles.detailContainer}>
      {/* Header */}
      <View style={styles.detailHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Détail du rendez-vous</Text>
      </View>

      {isLoading ? (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : !rendezvous ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
          <Text style={styles.emptyText}>Rendez-vous introuvable</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.detailContent}>

          {/* Main info */}
          <View style={styles.detailCard}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={18} color={colors.primary} />
              <Text style={styles.detailLabel}>Date</Text>
              <Text style={styles.detailValue}>{formatDate(rendezvous.date)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={18} color={colors.primary} />
              <Text style={styles.detailLabel}>Heure</Text>
              <Text style={styles.detailValue}>{formatTime(rendezvous.heure)}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="medical-outline" size={18} color={colors.primary} />
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{rendezvous.type}</Text>
            </View>
            <View style={[styles.detailRow, styles.detailRowLast]}>
              <Ionicons name="flag-outline" size={18} color={colors.primary} />
              <Text style={styles.detailLabel}>Statut</Text>
              <RendezvousStatusBadge statut={rendezvous.statut} />
            </View>
          </View>

          {/* Commentaire */}
          {rendezvous.commentaire && (
            <View style={styles.commentaireBox}>
              <Text style={styles.commentaireTitle}>Commentaire</Text>
              <Text style={styles.commentaireText}>{rendezvous.commentaire}</Text>
            </View>
          )}

        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default RendezvousDetailScreen;