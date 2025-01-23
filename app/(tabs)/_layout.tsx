import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "@/components/Header";
import { useTheme } from "@/contexts/ThemeContext";

export default function TabsLayout() {
  const { colours } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colours.text.primary,
        headerStyle: {
          backgroundColor: colours.background,
        },
        header: () => <Header />,
        tabBarStyle: {
          backgroundColor: colours.background,
        },
        headerTintColor: "#fff",
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Lists"
        options={{
          title: "Lists",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "list-sharp" : "list-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="Groups"
        options={{
          title: "Groups",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people-sharp" : "people-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="MyDecisions"
        options={{
          title: "Decisions",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "file-tray-full-sharp" : "file-tray-full-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}
