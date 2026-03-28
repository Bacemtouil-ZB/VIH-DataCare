import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ChangePasswordForm from '../components/ChangePasswordForm';
import authApi from '../../../api/auth.api';
import useAuthStore from '../../../store/authStore';
import styles from '../styles/changePassword.styles';
import colors from '../../../constants/colors';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const { clearMustChangePassword } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async (newPassword) => {
    setIsLoading(true);
    try {
      await authApi.changePassword(newPassword);
      clearMustChangePassword();
      // AppNavigator will automatically switch to AppTabs
      // because isAuthenticated = true and mustChangePassword = false
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur lors du changement de mot de passe',
      };
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={40} color={colors.white} />
          </View>
          <Text style={styles.title}>Changer le mot de passe</Text>
          <Text style={styles.subtitle}>
            C'est votre première connexion.{'\n'}
            Veuillez définir un mot de passe personnel.
          </Text>
        </View>

        {/* Form */}
        <ChangePasswordForm
          onSubmit={handleChangePassword}
          isLoading={isLoading}
        />

      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;