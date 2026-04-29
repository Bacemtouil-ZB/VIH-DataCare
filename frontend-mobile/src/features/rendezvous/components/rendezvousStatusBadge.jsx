import React from 'react';
import { View, Text } from 'react-native';
import styles from '../styles/rendezvous.styles';
import colors from '../../../constants/colors';

const STATUS_CONFIG = {
  planifie: {
    label: 'Planifié',
    backgroundColor: '#EFF6FF',
    textColor: '#2563EB',
  },
  confirmé: {
    label: 'Confirmé',
    backgroundColor: colors.primaryLight,
    textColor: colors.primary,
  },
  annulé: {
    label: 'Annulé',
    backgroundColor: '#FEF2F2',
    textColor: colors.danger,
  },
  terminé: {
    label: 'Terminé',
    backgroundColor: '#F0FDF4',
    textColor: colors.success,
  },
};

const RendezvousStatusBadge = ({ statut }) => {
  const key = statut?.toLowerCase();
  const config = STATUS_CONFIG[key] || {
    label: statut,
    backgroundColor: colors.borderLight,
    textColor: colors.textSecondary,
  };

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: config.textColor }]}>
        {config.label}
      </Text>
    </View>
  );
};

export default RendezvousStatusBadge;