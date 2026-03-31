import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../features/home/screens/homeScreen';
import RendezvousListScreen from '../features/rendezvous/screens/rendezvousListScreen';
import RendezvousDetailScreen from '../features/rendezvous/screens/rendezvousDetailScreen';
import RemindersListScreen from '../features/reminders/screens/remindersListScreen';
import CreateReminderScreen from '../features/reminders/screens/createReminderScreen';
import CustomTabBar from './tabBar/customTabBar';

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
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <Tab.Screen name="Rendezvous" component={RendezvousNavigator} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Reminders" component={RemindersNavigator} />
    </Tab.Navigator>
  );
};

export default AppTabs;
