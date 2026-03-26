//The bottom tab bar shown when user IS logged in.
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../features/home/screens/homeScreen';
import RendezvousListScreen from '../features/rendezvous/screens/rendezvousListScreen';
import RemindersListScreen from '../features/reminders/screens/remindersListScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Rendezvous') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Reminders') {
            iconName = focused ? 'alarm' : 'alarm-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen
        name="Rendezvous"
        component={RendezvousListScreen}
        options={{ tabBarLabel: 'Rendez-vous' }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersListScreen}
        options={{ tabBarLabel: 'Rappels' }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;