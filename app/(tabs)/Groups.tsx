import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isCreateGroupModalVisible, setIsCreateGroupModalVisible] =
    useState(false);
  const [myGroups, setMyGroups] = useState<Group[]>([]);

  const handleCreateGroupModalClose = () => {
    setIsCreateGroupModalVisible(false);
  };

  const handleCreateNewGroupPress = () => {
    setIsCreateGroupModalVisible(true);
  };

  useEffect(() => {
    setError("");
    setLoading(true);

    if (user.username !== null) {
      apiClient
        .get(`/users/${user._id}/groups`)
        .then(({ data }) => {
          setMyGroups(data);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          setError("Error loading groups");
        });
    } else {
      setLoading;
      setError("Not logged in");
    }
  }, [user]);

  const groupDataCollapsibles = myGroups.map((group) => {
    if (loading) {
      return <ActivityIndicator size="large" color={colours.text.primary} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    return (
      <View style={styles.contentContainer}>
        <Collapsible key={group._id} title={group.name}>
          <Text style={{ color: colours.text.primary }}>
            {group.description}
          </Text>
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
      </View>
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <View style={styles.modalContainer}>
        <Overlay
          isVisible={isCreateGroupModalVisible}
          onClose={handleCreateGroupModalClose}
          isKeyboardAvoiding={true}
        >
          <CreateGroupForm setMyGroups={setMyGroups} />
        </Overlay>
      </View>

      <ScrollView
        style={[
          styles.contentContainer,
          { backgroundColor: colours.background },
        ]}
      >
        <Text style={[styles.headerText, { color: colours.text.primary }]}>
          My Groups
        </Text>
        {groupDataCollapsibles}
      </ScrollView>

      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: colours.background },
        ]}
      >
        <CreateNewButton
          text={"New Group"}
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

  contentContainer: {
    // flexGrow: 1,
    marginBottom: 5,
    marginHorizontal: 15,
  },

  buttonContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },

  modalContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
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

  errorText: {
    textAlign: "center",
  },
});
