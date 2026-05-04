import React from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import colors from '../constants/colors';

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#16a34a', // green
        padding: 14,
        borderRadius: 12,
        marginHorizontal: 10,
      }}
    >
      <MaterialCommunityIcons name="check-circle" size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        <Text style={{ color: 'white' }}>{text2}</Text>
      </View>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dc2626', // red
        padding: 14,
        borderRadius: 12,
        marginHorizontal: 10,
      }}
    >
      <MaterialCommunityIcons name="alert-circle" size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        <Text style={{ color: 'white' }}>{text2}</Text>
      </View>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary, 
        padding: 14,
        borderRadius: 12,
        marginHorizontal: 10,
      }}
    >
      <MaterialCommunityIcons name="information" size={24} color="white" />
      <View style={{ marginLeft: 10 }}>
        <Text style={{ color: 'white', fontWeight: 'bold' }}>{text1}</Text>
        <Text style={{ color: 'white' }}>{text2}</Text>
      </View>
    </View>
  ),
};