import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack } from "expo-router";
import { UserProvider } from "@/utils/UserContext";

export default function RootLayout() {
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
