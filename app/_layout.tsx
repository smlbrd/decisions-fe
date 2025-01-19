import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { UserProvider } from "@/contexts/UserContext";
import { SocketProvider } from "@/contexts/SocketContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <SocketProvider>
        <GestureHandlerRootView>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="User" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </GestureHandlerRootView>
      </SocketProvider>
    </UserProvider>
  );
}
