import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useTheme } from "@/contexts/ThemeContext";

export default function Index() {
  const { colours } = useTheme();

  apiClient
    .get("/")
    .then(({ data }) => console.log(data))
    .catch(() => console.log("Server not online!"));

  return (
    <View style={[styles.container, { backgroundColor: colours.primary }]}>
      <Text>
        <Link href="/User">This is a link to the User Info</Link>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
