import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppTabs from './appTabs';
import SuiviScreen from '../features/suivi/screens/SuiviScreen';
import UrgenceScreen from '../features/urgence/screens/UrgenceScreen';

const Stack = createStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Tabs"    component={AppTabs} />
    <Stack.Screen name="Suivi"   component={SuiviScreen} />
    <Stack.Screen name="Urgence" component={UrgenceScreen} />
  </Stack.Navigator>
);

export default AppStack;