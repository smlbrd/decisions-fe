import { Collapsible } from "@/components/Collapsible";
import { CreateNewButton } from "@/components/CreateNewButton";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { groupData } from "../../dummy-data/groups";
import UserCard from "@/components/UserCard";

export default function Groups() {
  const usersById: { [key: string]: { username: string } } = {};
  // keys are strings, and so are values
  const groupDataCollapsibles = groupData.map((group) => {
    return (
      <Collapsible title={group.group_name}>
        {group.members.map((member) => {
          if (!usersById[member.$oid])
            usersById[member.$oid] = { username: "steve" }; // would be an axios get the user info
          return <UserCard username={usersById[member.$oid].username} />;
        })}
      </Collapsible>
    );
  });
  return (
    <View style={styles.container}>
      <CreateNewButton text={"Create New Group"} onPress={() => {}} />
      <Text style={styles.headerText}>My Groups</Text>
      {groupDataCollapsibles}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
});
