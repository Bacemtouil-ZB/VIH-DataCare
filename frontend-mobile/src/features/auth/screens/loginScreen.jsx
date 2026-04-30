import React from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import LoginForm from "../components/loginForm";
import useLogin from "../hooks/useLogin";
import styles from "../styles/login.styles";
import colors from "../../../constants/colors";
import LanguageSwitcher from "../components/languageSwitcher";
import useI18n from "../../../i18n/useI18n";

const LoginScreen = () => {
  const { handleLogin, isLoading } = useLogin();
  const { t, isRTL } = useI18n();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.logoWrapper}>
            <View style={styles.logoCircle}>
              <View style={styles.logoInnerCircle}>
                <MaterialCommunityIcons name="leaf" size={38} color={colors.primary} />
              </View>
            </View>

            <Text style={styles.appName}>Zaytouna</Text>
            <Text style={[styles.appTagline, isRTL && styles.textAlignRight]}>
              {t("login.appTagline")}
            </Text>

            <LanguageSwitcher />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.formHeader}>
            <Text style={[styles.formTitle, isRTL && styles.textAlignRight]}>
              {t("login.formTitle")}
            </Text>
            <Text style={[styles.formSubtitle, isRTL && styles.textAlignRight]}>
              {t("login.formSubtitle")}
            </Text>
          </View>

          <LoginForm onSubmit={handleLogin} isLoading={isLoading} />

          <View style={styles.forgotContainer}>
            <Text style={[styles.forgotText, isRTL && styles.textAlignRight]}>
              {t("login.forgotPasswordPrefix")}{" "}
              <Text style={styles.forgotHighlight}>{t("login.forgotPasswordHighlight")}</Text>{" "}
              {t("login.forgotPasswordSuffix")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
