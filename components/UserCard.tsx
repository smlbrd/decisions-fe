import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

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
  const { colours } = useTheme();
  const you = user._id === useUser().user._id ? " (you)" : "";

  return (
    <View style={[styles.card, { backgroundColor: colours.primary }]}>
      <Ionicons
        style={styles.profileIcon}
        name="person-circle-outline"
        size={24}
      />
      <Text style={[styles.username, { color: colours.text.primary }]}>
        {user.name + you}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 3,
    marginRight: 10,
  },
  profileIcon: {
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: "#ddd",
    marginRight: 10,
  },
  username: {
    flex: 1,
    fontSize: 14,
    color: "#333",
  },
});

export default UserCard;
