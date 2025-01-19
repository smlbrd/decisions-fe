import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import ListCard from "@/components/ListCard";
import { createList, getListsByUserId } from "../../api/api";
import { TextInput } from "react-native-gesture-handler";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import { ActivityIndicator } from "react-native";

type Option = {
  id: string;

  image_url: string;
};

type List = {
  _id: string;

  title: string;

  description: string;

  options: Option[];
};

export default function Lists() {
  const { user, loadUser } = useUser();

  const { colours } = useTheme();

  const [isCreateListModalVisible, setIsCreateListModalVisible] =
    useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | undefined>(undefined);

  const [listData, setListData] = useState<List[]>([]);

  const [newListTitle, setNewListTitle] = useState("");

  const [newListDescription, setNewListDescription] = useState("");

  const handleCreateListModalClose = () => {
    setIsCreateListModalVisible(false);
    setNewListTitle("");
    setNewListDescription("");
  };

  const handleCreateNewListPress = () => {
    setIsCreateListModalVisible(true);
  };

  const handleNewListSubmit = async () => {
    try {
      const newList = {
        title: newListTitle,
        description: newListDescription,
        owner: user._id,
      };

      const newlyCreatedList = await createList(newList);
      setListData((prev) => [...prev, newlyCreatedList]);
      handleCreateListModalClose();
    } catch (err) {
      console.log(err);
      setError(`Something went wrong while we were making your list: ${err}`);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const getLists = async () => {
      setLoading(true);

      if (!user._id) {
        setLoading(false);
        return;
      }

      try {
        const lists = await getListsByUserId(user._id);
        setListData(lists);
      } catch (err) {
        setError(`Error getting lists: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    getLists();
  }, [user._id]);

  return (
    <>
      <Overlay
        isVisible={isCreateListModalVisible}
        onClose={handleCreateListModalClose}
      >
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: colours.surface.primary }]}>
            Create New List
          </Text>

          <TextInput
            style={styles.textInput}
            placeholder="Title"
            placeholderTextColor={colours.text.disabled}
            value={newListTitle}
            onChangeText={setNewListTitle}
          />

          <TextInput
            style={styles.textInput}
            placeholder="Description"
            placeholderTextColor={colours.text.disabled}
            value={newListDescription}
            onChangeText={setNewListDescription}
          />

          <Button title="Submit" onPress={handleNewListSubmit} />
        </View>
      </Overlay>

      <ScrollView>
        <View style={styles.listsContainer}>
          <Text style={styles.headerText}>My Lists</Text>

          {loading ? (
            <ActivityIndicator size="large" color={colours.primary} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            listData.map((list) => (
              <ListCard
                key={list._id}
                id={list._id}
                title={list.title}
                description={list.description}
                options={list.options}
              />
            ))
          )}
        </View>

        <View style={styles.listsContainer}>
          <CreateNewButton
            text={"Create New"}
            onPress={handleCreateNewListPress}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  listsContainer: {
    justifyContent: "center",
    marginHorizontal: 15,
    marginBottom: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
  },
  modalContainer: {
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
  },
  textInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});
