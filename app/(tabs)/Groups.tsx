import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { CreateGroupForm } from "@/components/CreateGroupForm";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import UserCard from "@/components/UserCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import apiClient from "@/utils/api-client";

type Member = {
  _id: string;
  name: string;
  username: string;
  savedLists: [string];
  email: string;
};

type Group = {
  _id: string;
  name: string;
  description: string;
  members: Member[];
};

export default function Groups() {
  const { user } = useUser();
  const { colours } = useTheme();

  const [myGroups, setMyGroups] = useState<Group[]>([]);
  const [isLoadingGroups, setIsLoadingGroups] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);

  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalVisible(false);
  };

  const handleCreateNewGroupPress = () => {
    setIsCreateGroupModalVisible(true);
  };

  useEffect(() => {
    setErrMsg("");
    setIsLoadingGroups(true);

    if (user.username !== null) {
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
    } else {
      setIsLoadingGroups;
      setErrMsg("Not logged in");
    }
  }, [user]);

  const groupDataCollapsibles = myGroups.map((group) => {
    return (
      <Collapsible key={group._id} title={group.name}>
        <Text style={{ color: colours.text.primary }}>{group.description}</Text>
        {group.members.map((member) => {
          return (
            <UserCard key={member._id} user={member}>
              <TouchableOpacity
                style={[
                  styles.removeButton,
                  { backgroundColor: colours.error },
                ]}
                onPress={() => {}}
              >
                <Text
                  style={[
                    styles.removeButtonText,
                    { color: colours.text.primary },
                  ]}
                >
                  Remove
                </Text>
              </TouchableOpacity>
            </UserCard>
          );
        })}
      </Collapsible>
    );
  });

  return (
    <View
      style={(styles.groupsContainer, { backgroundColor: colours.background })}
    >
      <Overlay
        isVisible={isCreateGroupModalVisible}
        onClose={handleCreateGroupModalClose}
        isKeyboardAvoiding={true}
      >
        <CreateGroupForm setMyGroups={setMyGroups} />
      </Overlay>

      {errMsg ? (
        <Text style={{ color: colours.error }}>{errMsg}</Text>
      ) : isLoadingGroups ? (
        <Text style={{ color: colours.text.primary }}>Loading groups...</Text>
      ) : (
        <ScrollView>
          <Text style={[styles.headerText, { color: colours.text.primary }]}>
            My Groups
          </Text>
          {groupDataCollapsibles}
        </ScrollView>
      )}
      <View style={styles.createGroupButtonContainer}>
        <CreateNewButton
          text={"Create New Group"}
          onPress={handleCreateNewGroupPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
