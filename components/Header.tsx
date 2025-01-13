import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  return (
    <SafeAreaView>
      <View
        style={{
          height: 60,
          backgroundColor: "#25292e",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 15,
          flexDirection: "row",
        }}
      >
        <Text style={{ color: "white", fontSize: 20 }}>Decisions</Text>
        <View style={{ flexDirection: "row" }}>
          <Link href="/">
            <Ionicons
              name={"notifications-outline"}
              color={"white"}
              size={35}
            />
          </Link>
          <Link href="/User">
            <Ionicons
              name={"person-circle-outline"}
              color={"white"}
              size={35}
            />
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
