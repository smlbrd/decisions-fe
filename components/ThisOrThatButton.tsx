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
            backgroundColor: colours.surface.disabled,
            borderColor: colours.surface.primary,
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
    marginLeft: 8,
  },
  tileImage: {
    marginTop: 10,
    margin: 10,
    marginBottom: 0,
    width: 60,
    height: 60,
    borderRadius: 10,
  },
});
