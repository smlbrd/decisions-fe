import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiClient from "@/utils/api-client";
import UserCard from "./UserCard";
import { useUser } from "@/contexts/UserContext";
import { ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

type Props = {
  setMyGroups: React.Dispatch<React.SetStateAction<Group[]>>;
};

export const CreateGroupFormMobile = ({ setMyGroups }: Props) => {
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loadUsersErrMsg, setLoadUsersErrMsg] = useState("");
  const [users, setUsers] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    setLoadUsersErrMsg("");
    apiClient
      .get("/users")
      .then(({ data }) => {
        setUsers(data);
      })
      .catch((err) => {
        console.log(err);
        setLoadUsersErrMsg("there was an error loading users");
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

  type groupInfoProps = {
    name: string;
    description: string;
    members: userDataProps[];
  };
  const [groupInfoText, setGroupInfoText] = useState<groupInfoProps>({
    name: "",
    description: "",
    members: [],
  });
  useEffect(() => {
    const filtered = users.filter(
      (userInGroup: userDataProps) =>
        (userInGroup.username
          ?.toLowerCase()
          .includes(searchUsernameText.toLowerCase()) ||
          userInGroup.name
            ?.toLowerCase()
            .includes(searchUsernameText.toLowerCase())) &&
        !groupInfoText.members.some(
          (member) => member._id === userInGroup._id
        ) &&
        userInGroup._id !== user._id
    );
    setFilteredUsers(filtered);
  }, [searchUsernameText, users, groupInfoText]);
  const handleGroupInfoTextInput = (text: string, name: string) => {
    setGroupInfoText((groupInfoText) => {
      return { ...groupInfoText, [name]: text };
    });
  };

  const handlePostGroup = () => {
    setErrMsg("");
    if (!groupInfoText.name) {
      setErrMsg("Please enter a group name");
      return null;
    }
    if (!groupInfoText.description) {
      setErrMsg("Please enter a group description");
      return null;
    }
    setIsSuccess(false);
    setIsPosting(true);
    const members = groupInfoText.members.map((member) => {
      return { _id: member._id };
    });
    members.unshift({ _id: user._id });
    const body = { ...groupInfoText, members, owner: [user._id] };
    apiClient
      .post("/groups", body)
      .then(({ data }) => {
        setIsPosting(false);
        setIsSuccess(true);
        router.push("/Groups");
        setMyGroups((myGroups) => {
          return [...myGroups, data];
        });
      })
      .catch((err) => {
        setIsSuccess(false);
        setIsPosting(false);
        setErrMsg("there was an error creating this group: please try again");
        console.log(err);
      });
  };

  return (
    <View>
      {isPosting ? (
        <Text>Creating group...</Text>
      ) : isSuccess ? (
        <Text>Success! New group created</Text>
      ) : (
        <View>
          <Text style={styles.title}>CREATE NEW GROUP</Text>
          {errMsg && <Text style={styles.errText}>{errMsg}</Text>}
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
          <ScrollView style={styles.scrollView}>
            <View>
              <UserCard user={user}>
                <Text>OWNER</Text>
              </UserCard>
              {groupInfoText.members.map((member) => {
                return (
                  <UserCard key={member._id} user={member}>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => {
                        setGroupInfoText((groupInfoText) => {
                          const membersFilter = groupInfoText.members.filter(
                            (memberAdded) => {
                              return memberAdded._id !== member._id;
                            }
                          );
                          return { ...groupInfoText, members: membersFilter };
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </UserCard>
                );
              })}
            </View>
          </ScrollView>
          <Text>Add members to group</Text>
          <View style={styles.rowAlign}>
            <Ionicons name={"search"} color={"black"} size={24} />
            <TextInput
              style={styles.input}
              placeholder="Search"
              value={searchUsernameText}
              onChangeText={(text) => {
                setSearchUsernameText(text);
              }}
            />
          </View>
          <ScrollView style={styles.scrollView}>
            <View>
              {loadUsersErrMsg ? (
                <Text style={styles.errText}>{loadUsersErrMsg}</Text>
              ) : (
                filteredUsers.map((user: userDataProps) => (
                  <UserCard key={user._id} user={user}>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={() => {
                        setGroupInfoText((groupInfoText) => {
                          const members = groupInfoText.members;
                          members.push(user);
                          return {
                            ...groupInfoText,
                            members,
                          };
                        });
                      }}
                    >
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </UserCard>
                ))
              )}
            </View>
          </ScrollView>
          <Button title="Create New Group" onPress={handlePostGroup} />
        </View>
      )}
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
  removeButton: {
    backgroundColor: "#f44336",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#2DA042",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  errText: {
    color: "#FE141D",
    fontWeight: "bold",
  },
});
