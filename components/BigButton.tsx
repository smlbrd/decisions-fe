import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  onPress: () => void;
  text: string;
};

export const BigButton = ({ onPress, text }: Props) => {
  const { colours } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colours.surface.disabled,
            borderColor: colours.surface.primary,
          },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.text, { color: colours.text.disabled }]}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 36,
    borderRadius: 8,
    marginVertical: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
