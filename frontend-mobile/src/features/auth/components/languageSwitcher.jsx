import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "../styles/login.styles";
import useI18n from "../../../i18n/useI18n";

const LANGUAGE_OPTIONS = [
  { code: "fr", label: "FR" },
  { code: "ar", label: "AR" },
];

const LanguageSwitcher = () => {
  const { language, setLanguage, t, isRTL } = useI18n();

  return (
    <View style={[styles.languageSwitcher, isRTL && styles.rtlRow]}>
      <Text style={[styles.languageLabel, isRTL && styles.textAlignRight]}>
        {t("login.languageLabel")}
      </Text>

      <View style={[styles.languageOptions, isRTL && styles.rtlRow]}>
        {LANGUAGE_OPTIONS.map((option) => {
          const isActive = option.code === language;

          return (
            <TouchableOpacity
              key={option.code}
              style={[styles.languageOption, isActive && styles.languageOptionActive]}
              onPress={() => setLanguage(option.code)}
              activeOpacity={0.85}
            >
              <Text
                style={[
                  styles.languageOptionText,
                  isActive && styles.languageOptionTextActive,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default LanguageSwitcher;
