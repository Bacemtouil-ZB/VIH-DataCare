//The navigation stack shown when user is NOT logged in
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../features/auth/screens/loginScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;