import React, { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DropdownMenu, MenuOption } from "./DropdownMenu";
import { useRouter } from "expo-router";
import Overlay from "./Overlay";
import LogInForm from "./LogInForm";
import { useUser } from "@/utils/UserContext";

export default function Header() {
  const { user, removeUser } = useUser();
  const [isProfileDropdownVisible, setIsProfileDropdownVisible] =
    useState(false);
  const [isNotificationDropdownVisible, setIsNotificationDropdownVisible] =
    useState(false);
  const [isLoginFormVisible, setIsLoginFormVisible] = useState(false);
  const router = useRouter();
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
      <StatusBar barStyle="light-content" backgroundColor="#25292e" />
      <SafeAreaView
        style={{ backgroundColor: "#25292e" }} // match the SafeArea background with header
        edges={["top", "left", "right"]} // padding is only applied on top left and right
      >
        <View
          style={{
            height: 60,
            backgroundColor: "#25292e",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 15,
            flexDirection: "row",
          }}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Decisions</Text>
          <View style={{ flexDirection: "row" }}>
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
                  color={"white"}
                  size={35}
                />
              }
            >
              <MenuOption onSelect={() => {}}>
                <Text>Sparkle Unicorn invited you to make a decision</Text>
              </MenuOption>
              <MenuOption onSelect={() => {}}>
                <Text>Decision completed: view decision history</Text>
              </MenuOption>
            </DropdownMenu>

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
                  color={"white"}
                  size={35}
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
      </SafeAreaView>
    </>
  );
}
