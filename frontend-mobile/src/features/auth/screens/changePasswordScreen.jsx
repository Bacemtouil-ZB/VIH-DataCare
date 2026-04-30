import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ChangePasswordForm from "../components/ChangePasswordForm";
import authApi from "../../../api/auth.api";
import useAuthStore from "../../../store/authStore";
import styles from "../styles/changePassword.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const ChangePasswordScreen = () => {
  const { clearMustChangePassword } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const { t, isRTL } = useI18n();

  const handleChangePassword = async (newPassword) => {
    setIsLoading(true);

    try {
      await authApi.changePassword(newPassword);
      clearMustChangePassword();
      return { success: true };
    } catch (error) {
      setIsLoading(false);

      const apiMessage = error.response?.data?.message;
      return {
        success: false,
        message: apiMessage,
        messageKey: apiMessage ? undefined : "auth.changePasswordFailed",
      };
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="key-outline" size={40} color={colors.white} />
          </View>
          <Text style={[styles.title, isRTL && styles.textAlignRight]}>
            {t("changePassword.title")}
          </Text>
          <Text style={[styles.subtitle, isRTL && styles.textAlignRight]}>
            {t("changePassword.subtitleLine1")}
            {"\n"}
            {t("changePassword.subtitleLine2")}
          </Text>
        </View>

        <ChangePasswordForm onSubmit={handleChangePassword} isLoading={isLoading} />
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChangePasswordScreen;
