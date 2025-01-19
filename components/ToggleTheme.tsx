import React from "react";
import { View, Button, Text, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

const ToggleTheme = () => {
  const { theme, toggleTheme, colours } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Text style={{ color: colours.text.primary }}>{theme}</Text>
      <Button title="Theme" onPress={toggleTheme}></Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ToggleTheme;
