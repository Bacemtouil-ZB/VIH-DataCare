import React from "react";
import { View, Text, StyleSheet } from "react-native";

const EmptyState = ({ message }) => (
  <View style={styles.container}>
    <Text style={styles.emoji}>📭</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

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
});

export default EmptyState;