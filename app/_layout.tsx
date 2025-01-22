import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { UserProvider } from "@/contexts/UserContext";
import { SocketProvider } from "@/contexts/SocketContext";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout() {
  return (
    <SocketProvider>
      <UserProvider>
        <GestureHandlerRootView>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="User" />
              <Stack.Screen name="Decision" />
              <Stack.Screen name="DecisionHistory" />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </GestureHandlerRootView>
      </UserProvider>
    </SocketProvider>
  );
}
