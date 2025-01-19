import { useUser } from "@/utils/UserContext";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type userDataProps = {
  _id: string | null;
  username: string | null;
  name: string | null;
  email: string | null;
  savedLists: Array<string> | null;
};

type Props = {
  user: userDataProps;
  children: ReactNode | null;
};

const UserCard = ({ user, children }: Props) => {
  const you = user._id === useUser().user._id ? " (you)" : "";
  return (
    <View style={styles.card}>
      <Ionicons
        style={styles.profileIcon}
        name="person-circle-outline"
        size={24}
      />
      <Text style={styles.username}>{user.name + you}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});

export default UserCard;
