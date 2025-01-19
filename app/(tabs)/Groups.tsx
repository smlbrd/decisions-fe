import { Collapsible } from "@/components/Collapsible";
import { CreateNewButton } from "@/components/CreateNewButton";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import UserCard from "@/components/UserCard";
import Overlay from "@/components/Overlay";
import { ScrollView } from "react-native";
import apiClient from "@/utils/api-client";
import { useUser } from "@/utils/UserContext";
import { CreateGroupForm } from "@/components/CreateGroupForm";

export default function Groups() {
  const { user } = useUser();

  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalVisible(false);
  };
  const handleCreateNewGroupPress = () => {
    setIsCreateGroupModalVisible(true);
  };

  interface Member {
    _id: string;
    name: string;
    username: string;
    savedLists: [string];
    email: string;
  }
  interface Group {
    _id: string;
    name: string;
    description: string;
    members: Member[];
  }
  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
    setIsLoadingGroups(true);
    if (user.username !== null)
      apiClient
        .get(`/users/${user._id}/groups`)
        .then(({ data }) => {
          setMyGroups(data);
          setIsLoadingGroups(false);
        })
        .catch((err) => {
          setIsLoadingGroups(false);
          setErrMsg("Error loading groups");
        });
    else {
      setIsLoadingGroups;
      setErrMsg("Not logged in");
    }
  }, [user]);

  const groupDataCollapsibles = myGroups.map((group) => {
    return (
      <Collapsible key={group._id} title={group.name}>
        <Text>{group.description}</Text>
        {group.members.map((member) => {
          return <UserCard key={member._id} user={member} />;
        })}
      </Collapsible>
    );
  });
  return (
    <>
      <Overlay
        isVisible={isCreateGroupModalVisible}
        onClose={handleCreateGroupModalClose}
        isKeyboardAvoiding={true}
      >
        <CreateGroupForm />
      </Overlay>
      <View style={styles.createGroupButtonContainer}>
        <CreateNewButton
          text={"Create New Group"}
          onPress={handleCreateNewGroupPress}
        />
      </View>
      {errMsg ? (
        <Text>{errMsg}</Text>
      ) : isLoadingGroups ? (
        <Text>Loading groups...</Text>
      ) : (
        <ScrollView>
          <View style={styles.groupsContainer}>
            <Text style={styles.headerText}>My Groups</Text>
            {groupDataCollapsibles}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  createGroupButtonContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 5,
  },
  groupsContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
});
