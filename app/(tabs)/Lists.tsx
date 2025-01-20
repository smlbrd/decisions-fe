import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ActivityIndicator,
  Image,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import ListCard from "@/components/ListCard";
import { createList, getListbyListId, getListsByUserId } from "../../api/api";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";

type Option = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  customFields: [];
  owner: string;
};

type List = {
  _id: string;
  title: string;
  description: string;
  options: Option[];
  owner: string;
  members: [];
  createdAt: string;
};

const Lists = () => {
  const { user, loadUser } = useUser();
  const { colours } = useTheme();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const [listData, setListData] = useState<List[]>([]);

  const [isCreateListModalVisible, setIsCreateListModalVisible] =
    useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  const [isDetailListModalVisible, setIsDetailListModalVisible] =
    useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      if (!user._id) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const lists = await getListsByUserId(user._id);
        setListData(lists);
      } catch (err) {
        setError(`Error getting lists: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchLists();
  }, [user._id]);

  const handleDetailListModalClose = () => {
    setIsDetailListModalVisible(false);
    setSelectedList(null);
  };

  const handleListCardPress = async (listId: string) => {
    try {
      const listDetails = await getListbyListId(listId);
      setSelectedList(listDetails);
      setIsDetailListModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCreateListModalClose = () => {
    setIsCreateListModalVisible(false);
    setNewListTitle("");
    setNewListDescription("");
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
      setError(`Something went wrong while creating your list: ${err}`);
    }
  };

  const renderLists = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colours.text.primary} />;
    }

    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }

    return listData.map((list) => (
      <ListCard
        key={list._id}
        id={list._id}
        title={list.title}
        description={list.description}
        options={list.options}
        onPress={() => {
          handleListCardPress(list._id);
        }}
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Overlay
        isVisible={isDetailListModalVisible}
        onClose={handleDetailListModalClose}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colours.background },
          ]}
        >
          {selectedList ? (
            <View>
              <Text
                style={[styles.modalTitle, { color: colours.text.primary }]}
              >
                {selectedList.title}
              </Text>
              <Text
                style={[styles.modalField, { color: colours.text.primary }]}
              >
                {selectedList.description}
              </Text>
              <Text
                style={[styles.modalField, { color: colours.text.primary }]}
              >
                <View style={styles.modalOptionsList}>
                  {selectedList.options.map((option) => {
                    return (
                      <View>
                        <Image
                          key={option.id}
                          source={{
                            uri: option.image_url,
                          }}
                          style={styles.image}
                        />
                        <Text
                          style={[
                            styles.modalField,
                            {
                              color: colours.text.primary,
                              backgroundColor: colours.surface.primary,
                            },
                          ]}
                        >
                          {option.name}
                        </Text>
                        <Text
                          style={[
                            styles.modalField,
                            { color: colours.text.primary },
                          ]}
                        >
                          {option.description}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </Text>
            </View>
          ) : null}
        </View>
      </Overlay>

      <Overlay
        isVisible={isCreateListModalVisible}
        onClose={handleCreateListModalClose}
      >
        <View
          style={[
            styles.modalContainer,
            { backgroundColor: colours.background },
          ]}
        >
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colours.surface.primary,
                borderColor: colours.border,
              },
            ]}
            placeholder="Title"
            placeholderTextColor={colours.text.disabled}
            value={newListTitle}
            onChangeText={setNewListTitle}
          />
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colours.surface.primary,
                borderColor: colours.border,
              },
            ]}
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
          <Text style={[styles.headerText, { color: colours.text.primary }]}>
            My Lists
          </Text>
          {renderLists()}
        </View>
      </ScrollView>
      <View style={styles.listsContainer}>
        <CreateNewButton
          text="Create New"
          onPress={() => setIsCreateListModalVisible(true)}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listsContainer: {
    justifyContent: "center",
    marginBottom: 15,
    marginHorizontal: 15,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  errorText: {
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 12,
    marginHorizontal: 30,
  },
  modalField: {
    marginVertical: 10,
  },
  modalOptionsList: {
    flexDirection: "column",
  },
  image: {
    marginTop: 10,
    marginBottom: 0,
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
});

export default Lists;
