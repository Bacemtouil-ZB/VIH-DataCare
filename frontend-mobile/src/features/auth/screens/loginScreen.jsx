import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LoginForm from '../components/loginForm';
import useLogin from '../hooks/useLogin';
import styles from '../styles/login.styles';
import colors from '../../../constants/colors';

const LoginScreen = () => {
  const { handleLogin, isLoading } = useLogin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="medical" size={40} color={colors.white} />
          </View>
          <Text style={styles.title}>VIHDataCare</Text>
          <Text style={styles.subtitle}>Espace patient</Text>
        </View>

        {/* Form */}
        <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;