import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { Text, View, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  return (
    <>
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
            <Link href="/">
              <Ionicons
                name={"notifications-outline"}
                color={"white"}
                size={35}
              />
            </Link>
            <Link href="/User">
              <Ionicons
                name={"person-circle-outline"}
                color={"white"}
                size={35}
              />
            </Link>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
}
