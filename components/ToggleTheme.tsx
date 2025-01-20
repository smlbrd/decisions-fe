import React from "react";
import { View, StyleSheet, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

const ToggleTheme = () => {
  const { theme, toggleTheme, colours } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <TouchableOpacity onPress={toggleTheme}>
        {theme === "light" ? (
          <Ionicons
            name={"sunny-outline"}
            color={colours.text.primary}
            size={35}
          />
        ) : (
          <Ionicons
            name={"moon-outline"}
            color={colours.text.primary}
            size={35}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Platform.OS === "web" ? 0 : 24,
  },
});

export default ToggleTheme;
