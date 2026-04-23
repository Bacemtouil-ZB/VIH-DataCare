import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import useRendezvous from '../hooks/useRendezvous';
import RendezvousCard from '.zz';
import styles from '../styles/rendezvous.styles';
import colors from '../../../constants/colors';

const RendezvousListScreen = () => {
  const navigation = useNavigation();
  const { rendezvous, isLoading, error, refetch } = useRendezvous();
  
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
        </View>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={48} color={colors.danger} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mes Rendez-vous</Text>
        <Text style={styles.headerSubtitle}>
          {rendezvous.length} rendez-vous au total
        </Text>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {rendezvous.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={48} color={colors.textLight} />
            <Text style={styles.emptyText}>Aucun rendez-vous trouvé</Text>
          </View>
        ) : (
          rendezvous.map((item, index) => {
  return (
    <RendezvousCard
      key={item?.id?.toString() || index.toString()}
      rendezvous={item}
      onPress={() => navigation.navigate('RendezvousDetail', { id: item.id })}
    />
  );
})
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default RendezvousListScreen;