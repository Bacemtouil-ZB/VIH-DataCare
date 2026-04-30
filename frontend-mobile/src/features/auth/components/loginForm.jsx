import React, { useState } from "react";
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/login.styles";
import colors from "../../../constants/colors";
import useI18n from "../../../i18n/useI18n";

const LoginForm = ({ onSubmit, isLoading }) => {
  const { t, isRTL } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!username.trim() || !password.trim()) {
      setError(t("auth.requiredFields"));
      return;
    }

    const result = await onSubmit(username.trim(), password);

    if (result && !result.success) {
      if (result.message) {
        setError(result.message);
        return;
      }

      if (result.messageKey) {
        setError(t(result.messageKey));
        return;
      }

      setError(t("auth.loginFailed"));
    }
  };

  return (
    <View style={styles.form}>
      <View style={styles.inputWrapper}>
        <Text style={[styles.label, isRTL && styles.textAlignRight]}>
          {t("login.patientNumberLabel")}
        </Text>
        <View style={[styles.inputContainer, isRTL && styles.rtlRow]}>
          <Ionicons
            name="person-outline"
            size={20}
            color={colors.textSecondary}
            style={[styles.inputIcon, isRTL && styles.inputIconRtl]}
          />
          <TextInput
            style={[styles.input, isRTL && styles.textAlignRight]}
            placeholder={t("login.patientNumberPlaceholder")}
            placeholderTextColor={colors.textLight}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View style={styles.inputWrapper}>
        <Text style={[styles.label, isRTL && styles.textAlignRight]}>
          {t("login.passwordLabel")}
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
            placeholder={t("login.passwordPlaceholder")}
            placeholderTextColor={colors.textLight}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
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
          <Text style={styles.buttonText}>{t("login.submitButton")}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginForm;
