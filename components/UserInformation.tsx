import React from "react";
import { Text, View, Image, Button } from "react-native";

type UserInformationProps = {
  user: {
    _id: string | null;
    username: string | null;
    name: string | null;
    email: string | null;
    savedLists: Array<string> | null;
  };
};

const UserInformation: React.FC<UserInformationProps> = ({ user }) => {
  const { username, email, savedLists } = user;

  return (
    <View>
      {user._id && (
        <Image
          source={require("../assets/images/sparkly_unicorn.png")}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      )}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{username}</Text>
      <Text>@{username}</Text>

      {email && <Text>Email: {email}</Text>}

      {savedLists && savedLists.length > 0 && (
        <Text> Saved Lists here: {savedLists.join(", ")}</Text>
      )}
    </View>
  );
};

export default UserInformation;
