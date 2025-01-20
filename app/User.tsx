import React, { useEffect, useState } from "react";
import { Text, View, Button, Image } from "react-native";
import UserInformation from "../components/UserInformation";
import { TouchableOpacity } from "react-native"; //instead of button for logging out
import { ActivityIndicator } from "react-native"; // instead of text, spinner to show its loading
import { useRouter } from "expo-router";
import { useUser } from "@/contexts/UserContext";

export default function User() {
  const { user, removeUser } = useUser();
  const [isLoading, setLoading] = useState<boolean>(true);
  //   const [error, setError] = useState<string | null>(null)
  const router = useRouter();

  useEffect(() => {
    setLoading(!user._id);
  }, [user]);

  if (isLoading || !user._id) {
    return (
      <ActivityIndicator
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        size="large"
        color="#0000ff"
      />
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 30, marginBottom: 20 }}>My Profile</Text>

      {/* {user && ( */}
      <UserInformation user={user} />

      {user._id && (
        <TouchableOpacity
          onPress={() => {
            removeUser();
            router.push("/");
          }}
          style={{
            backgroundColor: "#ff4d4d",
            padding: 10,
            borderRadius: 5,
            marginTop: 20,
          }}
        >
          <Text style={{ color: "#fff", textAlign: "center" }}>Log Out</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
