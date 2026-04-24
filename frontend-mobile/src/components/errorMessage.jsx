import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useI18n from "../i18n/useI18n";

const ErrorMessage = ({ message, onRetry }) => {
  const { t, isRTL } = useI18n();

  return (
    <View style={styles.container}>
      <Text style={[styles.message, isRTL && styles.textRight]}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.btn} onPress={onRetry}>
          <Text style={styles.btnText}>{t("common.retry")}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  message: {
    fontSize: 15,
    color: "#E53E3E",
    textAlign: "center",
    marginBottom: 16,
  },
  btn: {
    backgroundColor: "#E53E3E",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
  },
  textRight: {
    textAlign: "right",
  },
});

export default ErrorMessage;
