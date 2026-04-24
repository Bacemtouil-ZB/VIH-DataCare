import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/changePassword.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const ChangePasswordForm = ({ onSubmit, isLoading }) => {
  const { t, isRTL } = useI18n();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError(t("auth.requiredFields"));
      return;
    }

    if (newPassword.length < 8) {
      setError(t("auth.passwordMinLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.passwordsDoNotMatch"));
      return;
    }

    const result = await onSubmit(newPassword);

    if (result && !result.success) {
      if (result.message) {
        setError(result.message);
        return;
      }

      if (result.messageKey) {
        setError(t(result.messageKey));
        return;
      }

      setError(t("auth.changePasswordFailed"));
    }
  };

  return (
    <View style={styles.form}>
      <View style={[styles.infoBox, isRTL && styles.rtlRow]}>
        <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
        <Text style={[styles.infoText, isRTL && styles.textAlignRight]}>{t("changePassword.info")}</Text>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={[styles.label, isRTL && styles.textAlignRight]}>
          {t("changePassword.newPasswordLabel")}
        </Text>
        <View style={[styles.inputContainer, isRTL && styles.rtlRow]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.textSecondary}
            style={[styles.inputIcon, isRTL && styles.inputIconRtl]}
          />
          <TextInput
            style={[styles.input, isRTL && styles.textAlignRight]}
            placeholder={t("changePassword.newPasswordPlaceholder")}
            placeholderTextColor={colors.textLight}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!showNew}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowNew(!showNew)}>
            <Ionicons
              name={showNew ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={[styles.label, isRTL && styles.textAlignRight]}>
          {t("changePassword.confirmPasswordLabel")}
        </Text>
        <View style={[styles.inputContainer, isRTL && styles.rtlRow]}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={colors.textSecondary}
            style={[styles.inputIcon, isRTL && styles.inputIconRtl]}
          />
          <TextInput
            style={[styles.input, isRTL && styles.textAlignRight]}
            placeholder={t("changePassword.confirmPasswordPlaceholder")}
            placeholderTextColor={colors.textLight}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {error ? (
        <View style={[styles.errorContainer, isRTL && styles.rtlRow]}>
          <Ionicons name="alert-circle-outline" size={16} color={colors.danger} />
          <Text style={[styles.errorText, isRTL && styles.textAlignRight]}>{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={styles.buttonText}>{t("changePassword.submitButton")}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordForm;
