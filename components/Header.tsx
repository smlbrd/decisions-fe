import React, { useState } from "react";
import { Text, View, StatusBar, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { DropdownMenu, MenuOption } from "./DropdownMenu";
import LogInForm from "./LogInForm";
import Notifications from "./Notifications";
import Overlay from "./Overlay";
import ToggleTheme from "./ToggleTheme";

export default function Header() {
  const { colours, theme } = useTheme();
  const { user, removeUser } = useUser();
  const router = useRouter();

  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);

  return (
    <>
      <Overlay
        isVisible={isLoginFormVisible}
        onClose={() => {
          setIsLoginFormVisible(false);
        }}
      >
        <LogInForm />
      </Overlay>

      <SafeAreaView
        style={{ backgroundColor: colours.background }}
        edges={["top", "left", "right"]}
      >
        {theme === "dark" && (
          <StatusBar
            barStyle="light-content"
            backgroundColor={colours.background}
          />
        )}

        <View
          style={[
            styles.headerContainer,
            { backgroundColor: colours.background },
          ]}
        >
          <TouchableOpacity onPress={() => router.push("/")}>
            <Text style={[styles.title, { color: colours.text.primary }]}>
              Decisions
            </Text>
          </TouchableOpacity>

          <View style={styles.iconContainer}>
            <View style={styles.iconButton}>
              <ToggleTheme />
            </View>
            <View>
              <DropdownMenu
                isVisible={isNotificationDropdownVisible}
                handleOpen={() => {
                  setIsNotificationDropdownVisible(true);
                }}
                handleClose={() => {
                  setIsNotificationDropdownVisible(false);
                }}
                trigger={
                  <Ionicons
                    name={"notifications-outline"}
                    color={colours.text.primary}
                    size={40}
                    style={styles.iconButton}
                  />
                }
              >
                <Notifications
                  setIsNotificationDropdownVisible={
                    setIsNotificationDropdownVisible
                  }
                />
              </DropdownMenu>
            </View>

            <View>
              <DropdownMenu
                isVisible={isProfileDropdownVisible}
                handleOpen={() => {
                  setIsProfileDropdownVisible(true);
                }}
                handleClose={() => {
                  setIsProfileDropdownVisible(false);
                }}
                trigger={
                  <Ionicons
                    name={"person-circle-outline"}
                    color={colours.text.primary}
                    size={40}
                    style={styles.iconButton}
                  />
                }
              >
                {user.username ? (
                  <>
                    <MenuOption onSelect={() => {}}>
                      <Text>Welcome {user.name}!</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        setIsProfileDropdownVisible(false);
                        router.push("/User");
                      }}
                    >
                      <Text>View Profile</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        setIsProfileDropdownVisible(false);
                        router.push("/DecisionHistory");
                      }}
                    >
                      <Text>View Decision History</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        removeUser();
                      }}
                    >
                      <Text>Sign Out</Text>
                    </MenuOption>
                  </>
                ) : (
                  <>
                    <MenuOption
                      onSelect={() => {
                        setIsProfileDropdownVisible(false);
                        setIsLoginFormVisible(true);
                      }}
                    >
                      <Text>Log In</Text>
                    </MenuOption>
                    <MenuOption onSelect={() => {}}>
                      <Text>Register</Text>
                    </MenuOption>
                  </>
                )}
              </DropdownMenu>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingLeft: 20,
    paddingRight: 10,
  },
  title: {
    fontSize: 24,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    margin: 0,
    padding: 10,
  },
});
