import React from "react";
import { Text, View, Image, Button } from "react-native";
// import { userData } from "../dummy-data/users";

type UserInformationProps = {
  userId: string;
  canSeeEmail: boolean;
  canEditLists: boolean;
  username: string;
  email?: string;
};

const UserInformation: React.FC<UserInformationProps> = ({
  userId,
  canSeeEmail,
  canEditLists,
  username,
  email,
}) => {

  return (
    <View>
      {/* Profile picture */}
      {userId && (
        <Image source={{ uri: 'https://www.istockphoto.com/photos/glitter-unicorn' }} style={{ width: 100, height: 100, borderRadius: 50 }} />
      )}
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{username}</Text>
      <Text>@{username}</Text>

      {canSeeEmail && email && <Text>Email: {email}</Text>}

      {canEditLists && <Text> Edit your Lists here</Text>}
    </View>
  );
  // }: UserInformationProps) {
  //   const user = userData.find((user) => user._id === userId.toString());
};

export default UserInformation;



