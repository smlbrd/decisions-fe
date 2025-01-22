import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import EditProfileForm from "../components/EditProfileForm";
import UserInformation from "../components/UserInformation";

export default function User() {
  const { user, saveUser } = useUser();
  const { colours } = useTheme();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isEditUser, setEditUser] = useState<boolean>(false);
  const [editableUser, setEditableUser] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
  });

  const router = useRouter();

  useEffect(() => {
    if (user._id) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    console.log("Logging Out");
    router.push("/");
  };

  const handleEditChange = (field: string, value: string) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    await saveUser({
      ...user,
      ...editableUser,
    });
    setEditUser(false);
  };

  if (isLoading || !user._id) {
    return (
      <View style={[styles.container, { backgroundColor: colours.background }]}>
        <ActivityIndicator size="large" color={colours.text.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.headerText, { color: colours.text.primary }]}>
          My Profile
        </Text>

        {!isEditUser ? (
          <UserInformation user={user} />
        ) : (
          <EditProfileForm
            user={editableUser}
            onChange={handleEditChange}
            onSave={handleSaveChanges}
          />
        )}

        <TouchableOpacity
          onPress={() => setEditUser(!isEditUser)}
          style={[
            styles.actionButton,
            { backgroundColor: colours.button.primary },
          ]}
        >
          <Text style={[styles.buttonText, { color: colours.text.primary }]}>
            {isEditUser ? "Cancel" : "Edit Profile"}{" "}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.actionButton, { backgroundColor: colours.error }]}
        >
          <Text style={[styles.buttonText, { color: colours.text.primary }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
    minWidth: 150,
  },
  buttonText: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
});
