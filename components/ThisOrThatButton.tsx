import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

type Props = {
  onPress: (arg0: number) => void;
  text: string;
  image_url?: string;
  thisOrThat: 0 | 1;
};

export const ThisOrThatButton = ({
  onPress,
  text,
  image_url,
  thisOrThat,
}: Props) => {
  const { colours } = useTheme();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colours.button.primary,
            borderColor: colours.text.primary,
          },
        ]}
        onPress={() => {
          return onPress(thisOrThat);
        }}
      >
        <Image
          source={{
            uri: image_url,
          }}
          style={styles.tileImage}
        />
        <Text style={[styles.text, { color: colours.text.primary }]}>
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
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
    borderRadius: 15,
    marginVertical: 32,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    margin: 10,
    marginLeft: 8,
  },
  tileImage: {
    margin: 10,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
