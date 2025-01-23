import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { DropdownMenu, MenuOption } from "./DropdownMenu";
import LogInForm from "./LogInForm";
import Notifications from "./Notifications";
import { useSocket } from "@/contexts/SocketContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Overlay from "./Overlay";
import ToggleTheme from "./ToggleTheme";

type activityProps = {
  msg: string;
  key: string;
  decision_id?: string;
};

export default function Header() {
  const isWeb = Platform.OS === "web";
  const [activity, setActivity] = useState<activityProps[]>([]);
  const [isBellRed, setIsBellRed] = useState(false);

  const handleSetActivity = async () => {
    let storedActivity;
    if (isWeb) {
      if (localStorage.getItem("activity"))
        storedActivity = localStorage.getItem("activity");
    } else {
      if (await AsyncStorage.getItem("activity"))
        storedActivity = await AsyncStorage.getItem("activity");
    }
    const parsedStoredActivity =
      storedActivity && storedActivity !== JSON.stringify(null)
        ? JSON.parse(storedActivity)
        : [
            {
              msg: "",
              key: "",
            },
          ];
    setActivity(parsedStoredActivity);
  };
  useEffect(() => {
    handleSetActivity();
  }, []);
  // console.log(activity);
  const socket = useSocket();
  socket.on("refresh", async (msg, key, decision_id) => {
    setActivity((activity) => {
      return [
        ...activity,
        {
          msg,
          key,
          decision_id,
        },
      ];
    });
    if (isWeb)
      localStorage.setItem(
        "activity",
        JSON.stringify([
          ...activity,
          {
            msg,
            decision_id,
          },
        ])
      );
    else
      await AsyncStorage.setItem(
        "activity",
        JSON.stringify([
          ...activity,
          {
            msg,
            decision_id,
          },
        ])
      );
    setIsBellRed(true);
    const uniqueNotificationKeys = isWeb
      ? localStorage.getItem("uniqueNotificationKeys") || "[]"
      : (await AsyncStorage.getItem("uniqueNotificationKeys")) || "[]";
    if (isWeb)
      if (JSON.parse(uniqueNotificationKeys) && !JSON.parse(uniqueNotificationKeys).includes(key))
        localStorage.setItem(
          "uniqueNotificationKeys",
          JSON.stringify([...JSON.parse(uniqueNotificationKeys), key])
        );
      else {
        if (JSON.parse(uniqueNotificationKeys) && !JSON.parse(uniqueNotificationKeys).includes(key))
          await AsyncStorage.setItem(
            "uniqueNotificationKeys",
            JSON.stringify([...JSON.parse(uniqueNotificationKeys), key])
          );
      }
  });
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
            <TouchableOpacity>
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
                    color={isBellRed ? "#FF2370" : colours.text.primary}
                    size={40}
                    style={styles.iconButton}
                  />
                }
              >
                <Notifications
                  setIsNotificationDropdownVisible={
                    setIsNotificationDropdownVisible
                  }
                  activity={activity}
                  setIsBellRed={setIsBellRed}
                />
              </DropdownMenu>
            </TouchableOpacity>

            <TouchableOpacity>
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
                        router.push("/ViewDecisions");
                      }}
                    >
                      <Text>Pending Decisions</Text>
                    </MenuOption>
                    <MenuOption
                      onSelect={() => {
                        setIsProfileDropdownVisible(false);
                        router.push("/DecisionHistory");
                      }}
                    >
                      <Text>Decision History</Text>
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
            </TouchableOpacity>
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
    paddingVertical: 12,
    paddingLeft: 24,
    paddingRight: 6,
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
    padding: 6,
  },
});
