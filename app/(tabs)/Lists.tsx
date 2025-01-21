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
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CreateNewButton } from "@/components/CreateNewButton";
import Overlay from "@/components/Overlay";
import ListCard from "@/components/ListCard";
import { useTheme } from "@/contexts/ThemeContext";
import { useUser } from "@/contexts/UserContext";
import apiClient from "@/utils/api-client";

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
      <ListCard
        key={list._id}
        id={list._id}
        title={list.title}
        description={list.description}
        options={list.options}
        onPress={() => {
          return handleListCardPress(list._id);
        }}
      />
    ));
  };

  return (
    <View style={[styles.container, { backgroundColor: colours.background }]}>
      <Overlay
        isVisible={isDetailListModalVisible}
        onClose={handleDetailListModalClose}
        scrollable={true}
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
        {errMsg ? (
          <Text style={styles.errorText}>{errMsg}</Text>
        ) : isLoading ? (
          <Text style={[{ color: colours.text.primary }]}>loading...</Text>
        ) : null}
        <View style={styles.listsContainer}>
          <Text style={[styles.headerText, { color: colours.text.primary }]}>
            My Lists
          </Text>
          {renderLists()}
        </View>
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
});

export default Lists;
