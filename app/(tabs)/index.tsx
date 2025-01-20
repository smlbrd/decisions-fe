import { Link, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import apiClient from "../../utils/api-client";
import { useSocket } from "@/contexts/SocketContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();
  const { colours } = useTheme();
  const socket = useSocket();
  socket.emit("hi", "hi");

  useEffect(() => {
    apiClient
      .get("/")
      .then(({ data }) => console.log(data))
      .catch(() => {
        router.push("/NotConnectedToServer");
      });
  }, []);

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
