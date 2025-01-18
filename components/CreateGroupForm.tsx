import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import { DropdownMenu, MenuOption } from "./DropdownMenu";

export const CreateGroupForm = () => {
  const [searchUsernameText, setSearchUsernameText] = useState("");
  const [groupInfoText, setGroupInfoText] = useState({
    name: "",
    description: "",
    members: [],
  });
  return (
    <View>
      <Text>CREATE NEW GROUP</Text>
      <Text>Enter group name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group name"
        value={searchUsernameText}
        onChangeText={setSearchUsernameText}
      />
      <Text>Enter group description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter group description"
        value={searchUsernameText}
        onChangeText={setSearchUsernameText}
      />
      <Text>Add members to group</Text>

      <DropdownMenu
        trigger={
          <TextInput
            style={styles.input}
            placeholder="Search by username"
            value={searchUsernameText}
            onChangeText={setSearchUsernameText}
          />
        }
        isVisible={false}
        handleClose={() => {}}
        handleOpen={() => {}}
        dropdownWidth={200}
      >
        <MenuOption onSelect={() => {}}>
          <Text>testing menu option</Text>
        </MenuOption>
      </DropdownMenu>

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
  input: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
