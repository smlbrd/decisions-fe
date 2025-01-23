import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import EditProfileForm from "../components/EditProfileForm";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import UserInformation from "../components/UserInformation";
import Header from "@/components/Header";
import SelectAvatar from "@/components/SelectAvatar";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

const stockAvatars = [
  "https://images.pexels.com/photos/2078478/pexels-photo-2078478.jpeg?",
  "https://images.pexels.com/photos/802112/pexels-photo-802112.jpeg",
  "https://images.pexels.com/photos/2610309/pexels-photo-2610309.jpeg?",
  "https://images.pexels.com/photos/1618606/pexels-photo-1618606.jpeg",
  "https://images.pexels.com/photos/2295744/pexels-photo-2295744.jpeg",
  "https://images.pexels.com/photos/53977/eagle-owl-raptor-falconry-owl-53977.jpeg",
  "https://images.pexels.com/photos/598966/pexels-photo-598966.jpeg",
];

export default function User() {
  const { user, saveUser, removeUser } = useUser();
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isEditUser, setEditUser] = useState<boolean>(false);
  const [editableUser, setEditableUser] = useState({
    name: user.name || "",
    username: user.username || "",
    email: user.email || "",
  });
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(
    user.avatarImg || null
  );
  const router = useRouter();
  const { colours } = useTheme();

  useEffect(() => {
    if (user._id) {
      setLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    removeUser();
    router.push("/");
  };

  const handleEditChange = (field: string, value: string) => {
    setEditableUser({ ...editableUser, [field]: value });
  };

  const handleSaveChanges = async () => {
    const updatedUser = {
      ...user,
      ...editableUser,
      avatarImg: selectedAvatar || user.avatarImg,
    };

    await saveUser(updatedUser);

    setEditUser(false);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
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
      <Header />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.headerText, { color: colours.text.primary }]}>
          My Profile
        </Text>

        {selectedAvatar ? (
          <Image
            source={
              selectedAvatar
                ? { uri: selectedAvatar }
                : require("../assets/images/default_avatar.png")
            }
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        ) : (
          <Image
            source={require("../assets/images/default_avatar.png")}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
        )}

        {!isEditUser ? (
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {user.username}
            </Text>
            <Text>@{user.username}</Text>
            {user.email && <Text>Email: {user.email}</Text>}
          </View>
        ) : (
          <EditProfileForm
            user={editableUser}
            onChange={handleEditChange}
            onSave={handleSaveChanges}
          />
        )}

        {isEditUser && (
          <SelectAvatar
            selectedAvatar={selectedAvatar}
            onAvatarClick={handleAvatarSelect}
            avatarOptions={stockAvatars}
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
