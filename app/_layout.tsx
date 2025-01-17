import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { UserProvider } from "@/utils/UserContext";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ip from "../ip";

interface ServerToClientEvents {
  welcome: (data: { message: string }) => void;
}

interface ClientToServerEvents {
  message: (data: { text: string }) => void;
}

export default function RootLayout() {
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const [message, setMessage] = useState<string>("");
  const [receivedMessage, setReceivedMessage] = useState<string>("");

  useEffect(() => {
    const newSocket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      `http://${ip}:9090`
    );
    setSocket(newSocket);

    // listen for messages from the server
    newSocket.on("welcome", (data) => {
      console.log(data.message);
      setReceivedMessage(data.message);
    });

    // Clean up the socket connection on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (socket) {
      socket.emit("message", { text: message });
      setMessage(""); // Clear input after sending
    }
  };

  return (
    <UserProvider>
      <GestureHandlerRootView>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="User" />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GestureHandlerRootView>
    </UserProvider>
  );
}
