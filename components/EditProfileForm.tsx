import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type EditProfileFormProps = {
  user: {
    name: string | null;
    username: string | null;
    email: string | null;
  };
  onChange: (field: string, value: string) => void;
  onSave: () => void;
};

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  user,
  onChange,
  onSave,
}) => {
  const { colours } = useTheme();
  return (
    <View style={{ padding: 10 }}>
      <Text
        style={{ fontSize: 30, marginBottom: 20, color: colours.text.primary }}
      >
        Edit Profile
      </Text>

      <TextInput
        style={{
          borderBottomWidth: 1,
          marginBottom: 10,
          fontSize: 18,
          color: colours.text.primary,
        }}
        value={user.username || ""}
        onChangeText={(text) => onChange("username", text)}
        placeholder="Username"
      />
      <TextInput
        style={{
          borderBottomWidth: 1,
          marginBottom: 10,
          fontSize: 18,
          color: colours.text.primary,
        }}
        value={user.name || ""}
        onChangeText={(text) => onChange("name", text)}
        placeholder="Name"
      />
      <TextInput
        style={{
          borderBottomWidth: 1,
          marginBottom: 10,
          fontSize: 18,
          color: colours.text.primary,
        }}
        value={user.email || ""}
        onChangeText={(text) => onChange("email", text)}
        placeholder="Email"
      />
      <TouchableOpacity
        onPress={onSave}
        style={{
          backgroundColor: colours.success,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 5,
          alignSelf: "center",
          marginTop: 20,
          minWidth: 150,
        }}
      >
        <Text style={[styles.buttonText, { color: colours.button.primary }]}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  userName: {
    textAlign: "left",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 14,
  },
  userNameSmall: {
    textAlign: "left",
    fontSize: 16,
    marginTop: 14,
  },
  userEmail: {
    textAlign: "left",
    fontSize: 16,
    marginTop: 10,
  },
  normalText: {
    textAlign: "left",
    fontSize: 16,
    marginTop: 10,
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

export default EditProfileForm;
