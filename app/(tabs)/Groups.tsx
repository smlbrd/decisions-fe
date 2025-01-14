import { Collapsible } from "@/components/Collapsible";
import { CreateNewButton } from "@/components/CreateNewButton";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { groupData } from "../../dummy-data/groups";
import UserCard from "@/components/UserCard";
import Overlay from "@/components/Overlay";
import { ScrollView } from "react-native-gesture-handler";

export default function Groups() {
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalVisible(false);
  };
  const handleCreateNewGroupPress = () => {
    setIsCreateGroupModalVisible(true);
  };
  const usersById: { [key: string]: { username: string } } = {};
  // keys are strings, and so are values
  const groupDataCollapsibles = groupData.map((group) => {
    return (
      <Collapsible key={group._id.$oid} title={group.group_name}>
        <Text>{group.group_desc}</Text>
        {group.members.map((member) => {
          if (!usersById[member.$oid])
            usersById[member.$oid] = { username: "steve" }; // would be an axios get the user info
          return (
            <UserCard
              key={member.$oid}
              username={usersById[member.$oid].username}
            />
          );
        })}
      </Collapsible>
    );
  });
  return (
    <>
      <Overlay
        isVisible={isCreateGroupModalVisible}
        onClose={handleCreateGroupModalClose}
      >
        <Text>This is the modal for creating a new group</Text>
      </Overlay>
      <View style={styles.container}>
        <CreateNewButton
          text={"Create New Group"}
          onPress={handleCreateNewGroupPress}
        />
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.headerText}>My Groups</Text>
          {groupDataCollapsibles}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
});
