import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = {
  onPress: () => void;
  text: string;
};

export const StartDecisionButton = ({ onPress, text }: Props) => {
  const { colours } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colours.button.primary,
            borderColor: colours.text.primary,
          },
        ]}
        onPress={onPress}
      >
        <Ionicons
          name="play-outline"
          color={colours.text.primary}
          style={styles.text}
        />
        <Text style={[styles.text, { color: colours.text.primary }]}>
          {text}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    marginTop: 200,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 6,
  },
});
