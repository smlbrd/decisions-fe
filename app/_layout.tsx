import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { UserProvider } from "@/utils/UserContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView>
      <UserProvider>
        <ThemeProvider>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="User" />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
}
