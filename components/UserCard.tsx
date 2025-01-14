import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

type Props = {
  username: string;
};

const UserCard = ({ username }: Props) => {
  const onRemove = () => {};
  return (
    <View style={styles.card}>
      <Ionicons
        style={styles.profileIcon}
        name="person-circle-outline"
        size={24}
      />
      <Text style={styles.username}>{username}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
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
  removeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default UserCard;
