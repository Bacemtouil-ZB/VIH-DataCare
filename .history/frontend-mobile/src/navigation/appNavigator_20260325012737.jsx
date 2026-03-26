// The root navigator — reads auth state and decides which stack to show.
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './authStack';
import AppTabs from './appTabs';
import useAuthStore from '../store/authStore';
import colors from '../constants/colors';

const AppNavigator = () => {
  const { isAuthenticated, restoreSession } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    const init = async () => {
      await restoreSession();
      setIsLoading(false);
    };
    init();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;