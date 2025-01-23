import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  ActivityIndicator,
  Image,
  Platform,
  TouchableOpacity,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import ListCard from "@/components/ListCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import apiClient from "@/utils/api-client";
import { Ionicons } from "@expo/vector-icons";

type Option = {
  _id: string;
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

  const [isLoadingListCard, setIsLoadingListCard] = useState(false);
  const [listCardErrMsg, setListCardErrMsg] = useState("");

  const [isPostingList, setIsPostingList] = useState(false);
  const [listCreationErrMsg, setListCreationErrMsg] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errMsg, setErrMsg] = useState<string | undefined>(undefined);

  const [listData, setListData] = useState<List[]>([]);

  const [isCreateListModalVisible, setIsCreateListModalVisible] =
    useState(false);
  const [newListTitle, setNewListTitle] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  const [isDetailListModalVisible, setIsDetailListModalVisible] =
    useState(false);
  const [selectedList, setSelectedList] = useState<List | null>(null);

  const [newOption, setNewOption] = useState<string>("");

  const [options, setOptions] = useState<string[]>([]);

  const [isEditListModalVisible, setIsEditListModalVisible] = useState(false);

  const [editListId, setEditListId] = useState<string | null>(null);

  const [editListTitle, setEditListTitle] = useState("");

  const [editListDescription, setEditListDescription] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setErrMsg("");
    if (!user._id) {
      setErrMsg("not logged in");
      return undefined;
    }
    apiClient
      .get(`users/${user._id}/saved_lists`)
      .then(({ data }) => {
        setIsLoading(false);
        setListData(data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        setErrMsg("there was an error loading users");
      });
  }, [user]);

  const handleDetailListModalClose = () => {
    setIsDetailListModalVisible(false);
    setSelectedList(null);
  };

  const handleListCardPress = (listId: string) => {
    setListCardErrMsg("");
    setIsLoadingListCard(true);
    setIsDetailListModalVisible(true);

    apiClient
      .get(`lists/${listId}`)
      .then(({ data }) => {
        setIsLoadingListCard(false);
        setSelectedList(data);
      })
      .catch((err) => {
        console.log(err);
        setIsLoadingListCard(false);
        setListCardErrMsg("there was an error loading this list");
      });
  };

  const handleCreateListModalClose = () => {
    setIsCreateListModalVisible(false);
    setNewListTitle("");
    setNewListDescription("");
  };

  const handleEditListModalClose = () => {
    setIsEditListModalVisible(false);
    setEditListId(null);
    setEditListTitle("");
    setEditListDescription("");
  };

  const handleEditList = (listId: string) => {
    const listToEdit = listData.find((list) => list._id === listId);
    if (listToEdit) {
      setEditListId(listToEdit._id);
      setEditListTitle(listToEdit.title);
      setEditListDescription(listToEdit.description);
      setIsEditListModalVisible(true);
    }
  };

  const handleEditListSubmit = () => {
    if (editListId) {
      apiClient
        .put(`/lists/${editListId}`, {
          title: editListTitle,
          description: editListDescription,
        })
        .then(({ data }) => {
          setListData((prevData) =>
            prevData.map((list) =>
              list._id === data._id ? { ...list, ...data } : list
            )
          );
          handleEditListModalClose();
        })
        .catch((err) => {
          console.log(err);
          setListCreationErrMsg("Something went wrong while editing your list");
        });
    }
  };

  const handleNewListSubmit = () => {
    setIsPostingList(true);
    if (!user._id) setErrMsg("user not logged in");
    const newList = {
      title: newListTitle,
      description: newListDescription,
      owner: user._id,
    };
    apiClient
      .post("/lists", newList)
      .then(({ data }) => {
        setListData((listData) => {
          return [...listData, data];
        });
      })
      .catch((err) => {
        console.log(err);
        setIsPostingList(false);
        setListCreationErrMsg("something went wrong while creating your list");
      });
  };

  const renderLists = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={colours.text.primary} />;
    }

    if (errMsg) {
      return <Text style={styles.errorText}>{errMsg}</Text>;
    }

    return listData?.map((list) => (
      <View key={list._id} style={styles.listCardContainer}>
        <ListCard
          key={list._id}
          id={list._id}
          title={list.title}
          description={list.description}
          options={list.options}
          onPress={() => handleListCardPress(list._id)}
        />
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => handleEditList(list._id)}
        >
          <Ionicons
            name="create-outline"
            size={24}
            color={colours.text.primary}
          />
        </TouchableOpacity>
      </View>
    ));
  };

  const handleAddOption = () => {
    setOptions((previousOptions) => [...previousOptions, ""]);
  };

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Overlay
        isVisible={isDetailListModalVisible}
        onClose={handleDetailListModalClose}
        scrollable={true}
        backgroundColour={colours.background}
      >
        <View>
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
                      <View key={option._id}>
                        <Image
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
        backgroundColour={colours.background}
      >
        <ScrollView contentContainerStyle={styles.scrollableModal}>
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
            <View style={styles.optionContainer}>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colours.surface.primary,
                    borderColor: colours.border,
                  },
                ]}
                placeholder="Add an option"
                placeholderTextColor={colours.text.disabled}
                value={newOption}
                onChangeText={setNewOption}
              />
              <TouchableOpacity
                style={[
                  styles.iconButton,
                  {
                    backgroundColor: colours.surface.disabled,
                    borderColor: colours.surface.primary,
                  },
                ]}
                onPress={handleAddOption}
              >
                <Ionicons
                  name="add-circle-outline"
                  size={24}
                  color={colours.text.disabled}
                />
              </TouchableOpacity>
            </View>

            {options.map((option, index) => (
              <View key={index} style={styles.optionContainer}>
                <TextInput
                  style={[
                    styles.textInput,
                    {
                      backgroundColor: colours.surface.primary,
                      borderColor: colours.border,
                    },
                  ]}
                  placeholder="Add an option"
                  placeholderTextColor={colours.text.disabled}
                  value={option}
                  onChangeText={(text) => {
                    const newOptions = [...options];
                    newOptions[index] = text;
                    setOptions(newOptions);
                  }}
                />
                <TouchableOpacity
                  style={[
                    styles.iconButton,
                    {
                      backgroundColor: colours.surface.disabled,
                      borderColor: colours.surface.primary,
                    },
                  ]}
                  onPress={handleAddOption}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={colours.text.disabled}
                  />
                </TouchableOpacity>
              </View>
            ))}

            <Button title="Submit" onPress={handleNewListSubmit} />
          </View>
        </ScrollView>
      </Overlay>

      <Overlay
        isVisible={isEditListModalVisible}
        onClose={handleEditListModalClose}
        backgroundColour={colours.background}
      >
        <ScrollView contentContainerStyle={styles.scrollableModal}>
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
              value={editListTitle}
              onChangeText={setEditListTitle}
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
              value={editListDescription}
              onChangeText={setEditListDescription}
            />
            <Button title="Save Changes" onPress={handleEditListSubmit} />
          </View>
        </ScrollView>
      </Overlay>

      <ScrollView>
        {errMsg ? (
          <Text style={styles.errorText}>{errMsg}</Text>
        ) : isLoading ? (
          <Text style={[{ color: colours.text.primary }]}>loading...</Text>
        ) : null}
        <View style={styles.listsContainer}>{renderLists()}</View>
      </ScrollView>

      <View style={styles.listsContainer}>
        <CreateNewButton
          text="New List"
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
  listCardContainer: {
    position: "relative",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 32,
    fontWeight: "bold",
  },
  errorText: {
    color: "#FE141D",
    fontWeight: "bold",
  },
  modalContainer: {
    ...(Platform.OS === "web" && {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 10,
    }),
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
  button: {
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
  },
  textInput: {
    height: 40,
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 15,
  },
  removeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 5,
    marginBottom: 5,
  },
  editButton: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  scrollableModal: {
    paddingBottom: 20,
  },
  overlay: {
    flex: 1,
  },
});

export default Lists;
