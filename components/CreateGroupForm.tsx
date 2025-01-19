import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import apiClient from "@/utils/api-client";
import UserCard from "./UserCard";
import { useUser } from "@/utils/UserContext";
import { ScrollView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

export const CreateGroupForm = () => {
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    apiClient
      .get("/users")
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  type userDataProps = {
    _id: string | null;
    username: string | null;
    name: string | null;
    email: string | null;
    savedLists: Array<string> | null;
  };
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [searchUsernameText, setSearchUsernameText] = useState("");
  const [groupInfoText, setGroupInfoText] = useState({
    name: "",
    description: "",
    members: [],
  });
  useEffect(() => {
    const filtered = users.filter(
      (user: userDataProps) =>
        user.username
          ?.toLowerCase()
          .includes(searchUsernameText.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchUsernameText.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchUsernameText, users]);
  const handleGroupInfoTextInput = (text: string, name: string) => {
    setGroupInfoText((groupInfoText) => {
      return { ...groupInfoText, [name]: text };
    });
  };

  return (
    <View>
      <Text style={styles.title}>CREATE NEW GROUP</Text>
      <Text>Enter group name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        value={groupInfoText.name}
        onChangeText={(text) => {
          handleGroupInfoTextInput(text, "name");
        }}
      />
      <Text>Enter group description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group description"
        value={groupInfoText.description}
        onChangeText={(text) => {
          handleGroupInfoTextInput(text, "description");
        }}
      />
      <Text>MY NEW GROUP</Text>
      <UserCard user={user} />
      <Text>Add members to group</Text>
      <View style={styles.rowAlign}>
        <Ionicons name={"search"} color={"black"} size={24} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          value={searchUsernameText}
          onChangeText={(text) => {
            setSearchUsernameText(text);
            console.log(filteredUsers);
          }}
        />
      </View>
      <ScrollView style={styles.scrollView}>
        <View>
          {filteredUsers.map((user: userDataProps) => (
            <Text>{user.username}</Text>
          ))}
        </View>
      </ScrollView>
      <Button title="Create New Group" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 30,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 5,
    paddingHorizontal: 10,
  },
  scrollView: {
    maxHeight: 200,
    borderColor: "lightgray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
  },
  rowAlign: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
