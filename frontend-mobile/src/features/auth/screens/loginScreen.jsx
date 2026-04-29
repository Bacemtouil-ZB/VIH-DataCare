import React from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top Section — Logo ── */}
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>

            {/* Logo */}
            <View style={styles.logoCircle}>
              <View style={styles.logoInnerCircle}>
                <MaterialCommunityIcons
                  name="leaf" 
                  size={38}
                  color={colors.primary}
                />
              </View>
            </View>

            {/* App name */}
            <Text style={styles.appName}>Zaytouna</Text> 
            <Text style={styles.appTagline}>Votre espace personnel</Text>

          </View>
        </View>

        {/* ── Bottom Section — Form ── */}
        <View style={styles.bottomSection}>

          {/* Form header */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Connexion</Text>
            <Text style={styles.formSubtitle}>
              Entrez vos identifiants pour accéder à votre espace
            </Text>
          </View>

          {/* Form */}
          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          {/* Forgot password */}
          <View style={styles.forgotContainer}>
            <Text style={styles.forgotText}>
              Mot de passe oublié ?{' '}
              <Text style={styles.forgotHighlight}>
                Contactez votre médecin
              </Text>
              {' '}pour réinitialiser votre accès.
            </Text>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;