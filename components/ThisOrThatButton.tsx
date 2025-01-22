import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
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
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    paddingHorizontal: 40,
    paddingVertical: 30,
    marginVertical: 16,
    ...Platform.select({
      web: {
        flex: 1,
      },
      android: {
        paddingHorizontal: 40,
        paddingVertical: 30,
      },
    }),
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    margin: 10,
  },
  tileImage: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});
