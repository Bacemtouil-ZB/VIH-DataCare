import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#E53E3E" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loader;