import { useTheme } from "@/contexts/ThemeContext";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

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
  const { colours } = useTheme();

  return (
    <View style={styles.container}>
      {user._id && (
        <Image
          source={require("../assets/images/sparkly_unicorn.png")}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
      )}
      <Text
        style={[
          styles.userName,
          styles.infoContainer,
          { color: colours.text.primary },
        ]}
      >
        {username}
      </Text>
      <Text
        style={[
          styles.userNameSmall,
          styles.infoContainer,
          { color: colours.text.primary },
        ]}
      >
        @{username}
      </Text>

      {email && (
        <Text
          style={[
            styles.userEmail,
            styles.infoContainer,
            { color: colours.text.primary },
          ]}
        >
          {email}
        </Text>
      )}

      {/* {savedLists && savedLists.length > 0 && (
        <Text style={[styles.normalText, { color: colours.text.secondary }]}>
          {" "}
          Saved Lists here: {savedLists.join(", ")}
        </Text>
      )} */}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  infoContainer: {
    margin: 10,
  },
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
});

export default UserInformation;
