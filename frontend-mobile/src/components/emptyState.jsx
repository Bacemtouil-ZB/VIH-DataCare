import React from "react";
import { StyleSheet, Text, View } from "react-native";
import useI18n from "../i18n/useI18n";

const EmptyState = ({ message }) => {
  const { isRTL } = useI18n(); // isrtl boolean to determine if the current language is right-to-left

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📭</Text>
      <Text style={[styles.message, isRTL && styles.textRight]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 60,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
  },
  textRight: {
    textAlign: "right",
  },
});

export default EmptyState;
