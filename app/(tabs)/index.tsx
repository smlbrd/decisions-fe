import { Link } from "expo-router";
import { Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";

export default function Index() {
  const socket = useSocket();
  socket.emit("hi", "hi");
  apiClient
    .get("/")
    .then(({ data }) => console.log(data))
    .catch(() => console.log("Server not online!"));
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
