import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ErrorMessage = ({ message, onRetry }) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.btn} onPress={onRetry}>
        <Text style={styles.btnText}>Réessayer</Text>
      </TouchableOpacity>
    )}
  </View>
);

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
});

export default ErrorMessage;