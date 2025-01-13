import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  onPress: () => void;
  text: string;
};

export const CreateNewButton = ({ onPress, text }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Ionicons name="add-circle-outline" size={24} color="#FFD700" />
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#25292e",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "#ffd33d",
    borderWidth: 1,
  },
  text: {
    color: "#ffd33d",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});
