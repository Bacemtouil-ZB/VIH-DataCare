import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../features/auth/screens/loginScreen';
import ChangePasswordScreen from '../features/auth/screens/changePasswordScreen';

const Stack = createStackNavigator();
//2 ecrans empilés : login et change password
const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;