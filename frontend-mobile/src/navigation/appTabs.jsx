import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../features/home/screens/homeScreen';
import RendezvousListScreen from '../features/rendezvous/screens/rendezvousListScreen';
import RendezvousDetailScreen from '../features/rendezvous/screens/rendezvousDetailScreen';
import RemindersListScreen from '../features/reminders/screens/remindersListScreen';
import CreateReminderScreen from '../features/reminders/screens/createReminderScreen';
import colors from '../constants/colors';

const Tab = createBottomTabNavigator();
const RendezvousStack = createStackNavigator();
const RemindersStack = createStackNavigator();

const RendezvousNavigator = () => (
  <RendezvousStack.Navigator screenOptions={{ headerShown: false }}>
    <RendezvousStack.Screen name="RendezvousList" component={RendezvousListScreen} />
    <RendezvousStack.Screen name="RendezvousDetail" component={RendezvousDetailScreen} />
  </RendezvousStack.Navigator>
);

const RemindersNavigator = () => (
  <RemindersStack.Navigator screenOptions={{ headerShown: false }}>
    <RemindersStack.Screen name="RemindersList" component={RemindersListScreen} />
    <RemindersStack.Screen name="CreateReminder" component={CreateReminderScreen} />
  </RemindersStack.Navigator>
);

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
        component={RendezvousNavigator}
        options={{ tabBarLabel: 'Rendez-vous' }}
      />
      <Tab.Screen
        name="Reminders"
        component={RemindersNavigator}
        options={{ tabBarLabel: 'Rappels' }}
      />
    </Tab.Navigator>
  );
};

export default AppTabs;