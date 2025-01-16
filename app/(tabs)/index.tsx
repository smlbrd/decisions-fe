import { Link } from "expo-router";
import { Text, View } from "react-native";
import apiClient from "../../utils/api-client";

export default function Index() {
  apiClient
    .get("/api")
    .then(({ data }) => console.log(data))
    .catch(err => console.log(err));
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>
        <Link href="/User">This is a link to the User Info</Link>
      </Text>
    </View>
  );
}
