import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import colors from '../../../constants/colors';

const UrgenceScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ padding: 16 }}
      >
        <Ionicons name="arrow-back" size={24} color={colors.textPrimary} />
      </TouchableOpacity>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Page Urgence — à configurer</Text>
      </View>
    </SafeAreaView>
  );
};

export default UrgenceScreen;