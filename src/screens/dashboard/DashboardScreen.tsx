import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

export function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Tela inicial</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  text: {
    fontSize: 18,
    color: COLORS.textSecondary,
  },
});
